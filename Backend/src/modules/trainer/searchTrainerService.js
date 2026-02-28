import client from "../../db.js";

export const searchTrainersService = async (filters) => {
  const { skill, location, minExp, maxExp, page, limit, sort } = filters;

  const where = {
    verified: true,
    isActive: true,
  };

  if (skill) {
    where.skills = { has: skill };
  }

  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  if (minExp !== undefined || maxExp !== undefined) {
    where.experience = {
      gte: minExp ?? undefined,
      lte: maxExp ?? undefined,
    };
  }

  const orderByMap = {
    experience_asc: { experience: "asc" },
    experience_desc: { experience: "desc" },
    newest: { createdAt: "desc" },
  };

  const [trainers, total] = await Promise.all([
    client.trainerProfile.findMany({
      where,
      orderBy: orderByMap[sort],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        bio: true,
        location: true,
        experience: true,
        skills: true,
        rating: true,
        verified: true,
        createdAt: true,
      },
    }),
    client.trainerProfile.count({ where }),
  ]);

  return {
    data: trainers,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
};
