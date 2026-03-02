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

export const updateTrainerProfileService = async (userId, data) => {
  try {
    const updateData = {};
    
    // Only include fields that are defined and valid
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.location !== undefined) updateData.location = data.location;
    if (Array.isArray(data.skills)) updateData.skills = data.skills;
    if (typeof data.experience === "number") updateData.experience = data.experience;
    
    // Use upsert to create if doesn't exist, update if exists
    const profile = await client.trainerProfile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        bio: data.bio ?? null,
        location: data.location ?? null,
        experience: typeof data.experience === "number" ? data.experience : 0,
        skills: Array.isArray(data.skills) ? data.skills : [],
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
        updatedAt: true,
      },
    });

    return profile;
  } catch (error) {
    console.error("Error in updateTrainerProfileService:", error);
    throw error;
  }
};

export const updateUserProfileService = async (userId, data) => {
  try {
    const user = await client.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
        profilePicture: data.avatar ?? undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("User not found");
    }
    throw error;
  }
};
