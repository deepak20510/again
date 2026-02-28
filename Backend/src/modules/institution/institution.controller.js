import {
  createInstitutionProfileService,
  getMyInstitutionProfileService,
} from "./institution.services.js";

export const createInstitutionProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const profile = await createInstitutionProfileService(
      userId,
      req.validated.body,
    );

    return res.status(201).json({
      success: true,
      message: "Institution profile created successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyInstitutionProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const profile = await getMyInstitutionProfileService(userId);

    return res.status(200).json({
      success: true,
      message: "Institution profile fetched successfully",
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};
