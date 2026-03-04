import bcrypt from "bcrypt";
import prisma from "../../db.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 4;

/**
 * Get all users with filtering and pagination
 * GET /admin/users
 */
export const getUsers = async (req, res) => {
  try {
    const { role, isVerified, isBanned, search, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};
    
    if (role) where.role = role;
    if (isVerified !== undefined && isVerified !== '') {
      where.isVerified = isVerified === 'true' || isVerified === true;
    }
    if (isBanned !== undefined && isBanned !== '') {
      where.isBanned = isBanned === 'true' || isBanned === true;
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true,
          isBanned: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          profilePicture: true,
          trainerProfile: {
            select: {
              id: true,
              verified: true,
              rating: true,
            },
          },
          institutionProfile: {
            select: {
              id: true,
              name: true,
              rating: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Verify a user (trainer or institution)
 * PATCH /admin/users/:id/verify
 */
export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified = true } = req.validated || req.body;
    const adminId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isVerified: true,
        trainerProfile: {
          select: { id: true, userId: true }
        },
        institutionProfile: {
          select: { id: true, userId: true }
        },
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isVerified: verified },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isBanned: true,
      },
    });

    // Also update trainer profile verified status if applicable
    if (user.trainerProfile && user.role === "TRAINER") {
      await prisma.trainerProfile.update({
        where: { userId: id },
        data: { verified: verified },
      });
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: verified ? "VERIFY_USER" : "UNVERIFY_USER",
        resource: "User",
        details: {
          targetUserId: id,
          targetUserEmail: user.email,
          role: user.role,
        },
      },
    });

    res.json({
      success: true,
      message: `User ${verified ? "verified" : "unverified"} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Ban or unban a user
 * PATCH /admin/users/:id/ban
 */
export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { banned = true, reason } = req.validated || req.body;
    const adminId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isBanned: true,
        trainerProfile: {
          select: { id: true, userId: true }
        },
        institutionProfile: {
          select: { id: true, userId: true }
        },
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent banning other admins
    if (user.role === "ADMIN" && banned) {
      return res.status(403).json({
        success: false,
        message: "Cannot ban admin users",
      });
    }

    // Update user ban status
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        isBanned: banned,
        isActive: !banned, // Also toggle isActive
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        isBanned: true,
        isActive: true,
      },
    });

    // Also update profile isActive status
    if (user.trainerProfile) {
      await prisma.trainerProfile.update({
        where: { userId: id },
        data: { isActive: !banned },
      });
    }

    if (user.institutionProfile) {
      await prisma.institutionProfile.update({
        where: { userId: id },
        data: { isActive: !banned },
      });
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: banned ? "BAN_USER" : "UNBAN_USER",
        resource: "User",
        details: {
          targetUserId: id,
          targetUserEmail: user.email,
          reason,
        },
      },
    });

    res.json({
      success: true,
      message: `User ${banned ? "banned" : "unbanned"} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get all reports with filtering and pagination
 * GET /admin/reports
 */
export const getReports = async (req, res) => {
  try {
    const { status, targetType, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (targetType) where.targetType = targetType;

    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          trainerProfile: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          institutionProfile: {
            select: {
              id: true,
              name: true,
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
          material: {
            select: {
              id: true,
              title: true,
              trainer: {
                select: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.report.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Error getting reports:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Take action on a report
 * PATCH /admin/reports/:id/action
 */
export const takeReportAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, resolutionNote } = req.body;
    const adminId = req.user.id;

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            email: true,
          },
        },
        trainerProfile: {
          select: {
            userId: true,
          },
        },
        institutionProfile: {
          select: {
            userId: true,
          },
        },
        material: {
          select: {
            trainer: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    let status;
    let bannedUserId = null;

    switch (action) {
      case "RESOLVE":
        status = "RESOLVED";
        break;
      case "REJECT":
        status = "DISMISSED";
        break;
      case "BAN_USER":
        status = "RESOLVED";
        // Determine which user to ban
        if (report.trainerProfile) {
          bannedUserId = report.trainerProfile.userId;
        } else if (report.institutionProfile) {
          bannedUserId = report.institutionProfile.userId;
        } else if (report.material) {
          bannedUserId = report.material.trainer.userId;
        }

        if (bannedUserId) {
          await prisma.user.update({
            where: { id: bannedUserId },
            data: { 
              isBanned: true,
              isActive: false,
            },
          });

          // Also deactivate trainer profile if exists
          await prisma.trainerProfile.updateMany({
            where: { userId: bannedUserId },
            data: { isActive: false },
          });

          // Also deactivate institution profile if exists
          await prisma.institutionProfile.updateMany({
            where: { userId: bannedUserId },
            data: { isActive: false },
          });
        }
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action",
        });
    }

    // Update the report
    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status,
        resolvedAt: new Date(),
        resolvedBy: adminId,
        details: resolutionNote
          ? `${report.details || ""}\n\nResolution: ${resolutionNote}`.trim()
          : report.details,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: `REPORT_${action}`,
        resource: "Report",
        details: {
          reportId: id,
          action,
          bannedUserId,
          resolutionNote,
        },
      },
    });

    res.json({
      success: true,
      message: `Report ${action.toLowerCase().replace("_", " ")}d successfully`,
      data: updatedReport,
    });
  } catch (error) {
    console.error("Error taking report action:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Get system analytics
 * GET /admin/analytics
 */
export const getAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalTrainers,
      totalInstitutions,
      totalStudents,
      totalMaterials,
      totalRequests,
      newUsersLast30Days,
      pendingReports,
      resolvedReports,
      usersByRole,
      recentUsers,
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.user.count({ where: { role: "TRAINER" } }),
      prisma.user.count({ where: { role: "INSTITUTION" } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.material.count(),
      prisma.request.count(),
      
      // New users in last 30 days
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      
      // Reports stats
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "RESOLVED" } }),
      
      // Users grouped by role
      prisma.user.groupBy({
        by: ["role"],
        _count: {
          role: true,
        },
      }),
      
      // Recent users (last 5)
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    // Get daily user registrations for the last 30 days
    const dailyRegistrationsRaw = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;
    
    // Convert BigInt to Number for JSON serialization
    const dailyRegistrations = dailyRegistrationsRaw.map(item => ({
      date: item.date,
      count: Number(item.count)
    }));

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalTrainers,
          totalInstitutions,
          totalStudents,
          totalMaterials,
          totalRequests,
          newUsersLast30Days,
        },
        reports: {
          pending: pendingReports,
          resolved: resolvedReports,
        },
        usersByRole: usersByRole.map(item => ({
          role: item.role,
          count: item._count.role,
        })),
        recentUsers,
        dailyRegistrations,
      },
    });
  } catch (error) {
    console.error("Error getting analytics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get all verification requests
 * GET /admin/verification-requests
 */
export const getVerificationRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;

    const [requests, totalCount] = await Promise.all([
      prisma.verificationRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              profilePicture: true,
              isVerified: true,
              trainerProfile: {
                select: {
                  id: true,
                  uniqueId: true,
                  verified: true,
                  rating: true,
                  experience: true
                }
              },
              institutionProfile: {
                select: {
                  id: true,
                  uniqueId: true,
                  name: true,
                  rating: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit)
      }),
      prisma.verificationRequest.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error("Error getting verification requests:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * Approve or reject verification request
 * PATCH /admin/verification-requests/:id/review
 */
export const reviewVerificationRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminNote } = req.body; // action: "APPROVE" or "REJECT"
    const adminId = req.user.id;

    if (!["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be APPROVE or REJECT"
      });
    }

    const verificationRequest = await prisma.verificationRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!verificationRequest) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found"
      });
    }

    if (verificationRequest.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "This request has already been reviewed"
      });
    }

    const newStatus = action === "APPROVE" ? "ACCEPTED" : "REJECTED";

    // Update verification request
    const updatedRequest = await prisma.verificationRequest.update({
      where: { id },
      data: {
        status: newStatus,
        adminNote: adminNote || null,
        reviewedAt: new Date(),
        reviewedBy: adminId
      }
    });

    // If approved, update user and profile verification status
    if (action === "APPROVE") {
      await prisma.user.update({
        where: { id: verificationRequest.userId },
        data: { isVerified: true }
      });

      // Update trainer profile if applicable
      if (verificationRequest.user.role === "TRAINER") {
        await prisma.trainerProfile.updateMany({
          where: { userId: verificationRequest.userId },
          data: { verified: true }
        });
      }

      // Create notification
      await prisma.notification.create({
        data: {
          userId: verificationRequest.userId,
          type: "VERIFICATION",
          title: "Verification Approved",
          message: "Congratulations! Your verification request has been approved.",
          link: `/profile`
        }
      });
    } else {
      // Create notification for rejection
      await prisma.notification.create({
        data: {
          userId: verificationRequest.userId,
          type: "VERIFICATION",
          title: "Verification Request Rejected",
          message: adminNote || "Your verification request has been rejected. Please contact support for more information.",
          link: `/profile`
        }
      });
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: `VERIFICATION_${action}`,
        resource: "VerificationRequest",
        details: {
          requestId: id,
          targetUserId: verificationRequest.userId,
          targetUserEmail: verificationRequest.user.email,
          adminNote
        }
      }
    });

    res.json({
      success: true,
      message: `Verification request ${action.toLowerCase()}d successfully`,
      data: updatedRequest
    });
  } catch (error) {
    console.error("Error reviewing verification request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Transfer admin privileges to another user
 * POST /admin/transfer-admin
 */
export const transferAdmin = async (req, res) => {
  try {
    const { newAdminEmail, currentPassword } = req.body;
    const currentAdminId = req.user.id;

    // Verify current admin's password
    const currentAdmin = await prisma.user.findUnique({
      where: { id: currentAdminId },
      select: { id: true, password: true, email: true }
    });

    if (!currentAdmin) {
      return res.status(404).json({
        success: false,
        message: "Current admin not found",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(currentPassword, currentAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Find the new admin user
    const newAdmin = await prisma.user.findUnique({
      where: { email: newAdminEmail.toLowerCase().trim() },
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    });

    if (!newAdmin) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    if (newAdmin.role === "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "This user is already an admin",
      });
    }

    // Transfer admin privileges in a transaction
    await prisma.$transaction([
      // Promote new user to admin
      prisma.user.update({
        where: { id: newAdmin.id },
        data: { 
          role: "ADMIN",
          isVerified: true,
          isBanned: false 
        },
      }),
      // Demote current admin to student (or you can delete them)
      prisma.user.update({
        where: { id: currentAdminId },
        data: { role: "STUDENT" },
      }),
      // Log the action
      prisma.auditLog.create({
        data: {
          userId: currentAdminId,
          action: "TRANSFER_ADMIN",
          resource: "User",
          details: {
            previousAdmin: currentAdmin.email,
            newAdmin: newAdmin.email,
            newAdminId: newAdmin.id,
          },
        },
      }),
    ]);

    res.json({
      success: true,
      message: `Admin privileges transferred to ${newAdminEmail} successfully`,
      data: {
        newAdmin: {
          id: newAdmin.id,
          email: newAdmin.email,
          firstName: newAdmin.firstName,
          lastName: newAdmin.lastName,
        },
      },
    });
  } catch (error) {
    console.error("Error transferring admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
