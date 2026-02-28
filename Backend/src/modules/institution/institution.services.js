import client from "../../db.js";
import xss from "xss";

export const createInstitutionProfileService = async (userId, data) => {
  const user = await client.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== "INSTITUTION") {
    throw new Error("Only institutions can create institution profile");
  }

  const existing = await client.institutionProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new Error("Institution profile already exists");
  }

  const profile = await client.institutionProfile.create({
    data: {
      userId,
      name: xss(data.name),
      location: xss(data.location),
    },
    select: {
      id: true,
      name: true,
      location: true,
      createdAt: true,
    },
  });

  return profile;
};

export const getMyInstitutionProfileService = async (userId) => {
  const profile = await client.institutionProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      name: true,
      location: true,
      createdAt: true,
    },
  });

  if (!profile) {
    throw new Error("Institution profile not found");
  }

  return profile;
};
