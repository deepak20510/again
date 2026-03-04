import client from "../../db.js";

export const searchTrainersService = async (filters) => {
  const { skill, location, minExp, maxExp, page, limit, sort } = filters;

  const where = {
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
    rating: { rating: "desc" },
  };

  const [trainers, total] = await Promise.all([
    client.trainerProfile.findMany({
      where,
      orderBy: orderByMap[sort] || { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            role: true,
            isVerified: true,
          },
        },
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
