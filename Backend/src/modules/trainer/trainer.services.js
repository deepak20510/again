import client from "../../db.js";

export const createTrainerProfileService = async (userId, data) => {
  try {
    const profile = await client.trainerProfile.create({
      data: {
        userId,
        bio: data.bio ?? null,
        location: data.location ?? null,
        experience: data.experience,
        skills: data.skills,
      },
      select: {
        id: true,
        bio: true,
        location: true,
        experience: true,
        skills: true,
        rating: true,
        verified: true,
        isActive: true,
        createdAt: true,
      },
    });

    return profile;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Trainer profile already exists");
    }
    throw error;
  }
};

export const getMyTrainerProfileService = async (userId) => {
  const profile = await client.trainerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      bio: true,
      location: true,
      experience: true,
      skills: true,
      rating: true,
      verified: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!profile) {
    throw new Error("Trainer profile not found");
  }

  return profile;
};
