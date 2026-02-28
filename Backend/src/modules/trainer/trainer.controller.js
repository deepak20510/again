import { searchTrainersService } from "./searchTrainerService.js";
import {
  createTrainerProfileService,
  getMyTrainerProfileService,
} from "./trainer.services.js";

export const createTrainerProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const profile = await createTrainerProfileService(
      userId,
      req.validated.body,
    );

    return res.status(201).json({
      success: true,
      message: "Trainer profile created successfully",
      data: profile,
      meta: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const profile = await getMyTrainerProfileService(userId);

    return res.status(200).json({
      success: true,
      message: "Trainer profile fetched successfully",
      data: profile,
      meta: null,
    });
  } catch (error) {
    next(error);
  }
};

export const searchTrainers = async (req, res, next) => {
  try {
    const result = await searchTrainersService(req.validated.query);

    return res.status(200).json({
      success: true,
      message: "Trainers fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};
