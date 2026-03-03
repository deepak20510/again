import express from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";
import {
  getUsers,
  verifyUser,
  banUser,
  getReports,
  takeReportAction,
  getAnalytics,
} from "./admin.controller.js";
import {
  getUsersSchema,
  userIdParamSchema,
  verifyUserSchema,
  banUserSchema,
  reportActionSchema,
  getReportsSchema,
  reportIdParamSchema,
} from "./admin.schema.js";

const router = express.Router();

// All routes require admin authentication
router.use(adminMiddleware);

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with filtering and pagination
 * @access  Admin only
 */
router.get("/users", validate(getUsersSchema, "query"), getUsers);

/**
 * @route   PATCH /api/v1/admin/users/:id/verify
 * @desc    Verify or unverify a user
 * @access  Admin only
 */
router.patch(
  "/users/:id/verify",
  validate(userIdParamSchema, "params"),
  validate(verifyUserSchema),
  verifyUser
);

/**
 * @route   PATCH /api/v1/admin/users/:id/ban
 * @desc    Ban or unban a user
 * @access  Admin only
 */
router.patch(
  "/users/:id/ban",
  validate(userIdParamSchema, "params"),
  validate(banUserSchema),
  banUser
);

/**
 * @route   GET /api/v1/admin/reports
 * @desc    Get all reports with filtering and pagination
 * @access  Admin only
 */
router.get("/reports", validate(getReportsSchema, "query"), getReports);

/**
 * @route   PATCH /api/v1/admin/reports/:id/action
 * @desc    Take action on a report (resolve, reject, ban user)
 * @access  Admin only
 */
router.patch(
  "/reports/:id/action",
  validate(reportIdParamSchema, "params"),
  validate(reportActionSchema),
  takeReportAction
);

/**
 * @route   GET /api/v1/admin/analytics
 * @desc    Get system analytics overview
 * @access  Admin only
 */
router.get("/analytics", getAnalytics);

export default router;
