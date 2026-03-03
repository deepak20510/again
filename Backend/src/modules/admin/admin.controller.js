import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    if (isVerified !== undefined) where.isVerified = isVerified;
    if (isBanned !== undefined) where.isBanned = isBanned;
    
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
    const { verified = true } = req.body;
    const adminId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        trainerProfile: true,
        institutionProfile: true,
      },
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
    const { banned = true, reason } = req.body;
    const adminId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        trainerProfile: true,
        institutionProfile: true,
      },
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
    const dailyRegistrations = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

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
    });
  }
};
