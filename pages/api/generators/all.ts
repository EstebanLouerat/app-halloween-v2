// Nom du fichier : /pages/api/generators/all.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Récupérer tous les générateurs avec leurs settings
    const generators = await prisma.generator.findMany({
      include: { settings: true },
    });

    const totalGen = generators.length;
    const totalGenDone = await prisma.generator.count({
      where: {
        timeLeft: { lte: 0 },
      },
    });

    const formattedGenerators = generators.map((gen) => {
      const timerDuration = gen.settings?.timerDuration;

      return {
        id: gen.id,
        name: gen.name,
        timeLeft: gen.timeLeft,
        isActif: gen.isActif,
        progress: timerDuration
          ? Math.max(0, 100 - Math.round((gen.timeLeft / timerDuration) * 100))
          : 0, // Valeur de fallback si settings est manquant
      };
    });

    res.status(200).json({
      totalGen,
      totalGenDone,
      generators: formattedGenerators,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des générateurs :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
