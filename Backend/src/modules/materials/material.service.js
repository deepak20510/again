import client from "../../db.js";
import xss from "xss";

export const uploadMaterialService = async (userId, file, title) => {
  if (!file) throw new Error("File is required");

  const trainer = await client.trainerProfile.findUnique({
    where: { userId },
    select: { id: true, isActive: true },
  });
  console.log("TRAINER:", trainer); // 👈 ADD HERE

  if (!trainer || !trainer.isActive) {
    throw new Error("Trainer not allowed to upload");
  }

  const cleanTitle = xss(title);

  const material = await client.material.create({
    data: {
      title: cleanTitle, // <-- save sanitized version
      fileUrl: `/materials/${file.filename}`,
      trainerId: trainer.id,
    },
    select: {
      id: true,
      title: true,
      fileUrl: true,
      createdAt: true,
    },
  });

  return material;
};

export const getTrainerMaterialsService = async (trainerId) => {
  return await client.material.findMany({
    where: { trainerId },
    select: {
      id: true,
      title: true,
      fileUrl: true,
      createdAt: true,
    },
  });
};
