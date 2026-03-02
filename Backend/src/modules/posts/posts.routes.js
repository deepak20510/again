import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getMyPosts,
} from "./posts.controller.js";

import { validate } from "../../middleware/validate.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createPostSchema,
  updatePostSchema,
  getPostsSchema,
} from "./posts.schema.js";

const router = express.Router();

// Protected routes (must come BEFORE /:postId to avoid route conflict)
router.get(
  "/my-posts",
  authMiddleware(["TRAINER", "INSTITUTION", "STUDENT"]),
  validate(getPostsSchema, "query"),
  getMyPosts,
);

// Public routes
router.get("/", validate(getPostsSchema, "query"), getPosts);
router.get("/:postId", getPostById);

// Protected routes - trainers and institutions only
router.post(
  "/",
  authMiddleware(["TRAINER", "INSTITUTION"]),
  validate(createPostSchema, "body"),
  createPost,
);
router.put(
  "/:postId",
  authMiddleware(["TRAINER", "INSTITUTION", "STUDENT", "ADMIN"]),
  validate(updatePostSchema, "body"),
  updatePost,
);
router.delete("/:postId", authMiddleware(["TRAINER", "INSTITUTION", "STUDENT", "ADMIN"]), deletePost);
router.post("/:postId/like", authMiddleware(["TRAINER", "INSTITUTION", "STUDENT"]), likePost);
router.delete("/:postId/like", authMiddleware(["TRAINER", "INSTITUTION", "STUDENT"]), unlikePost);

export default router;
