// Nom du fichier : /pages/api/generators/[id]/done.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Récupérer le générateur spécifique
    const generator = await prisma.generator.findUnique({
      where: { id: String(id) },
    });

    if (!generator) {
      return res.status(404).json({ error: "Générateur non trouvé" });
    }

    // Compter tous les générateurs et ceux terminés (timeLeft <= 0)
    const totalGenDone = await prisma.generator.count({
      where: {
        settingsName: generator.settingsName,
        timeLeft: { lte: 0 },
      },
    });

    res.status(200).json({ totalGenDone });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des générateurs terminés :",
      error
    );
    res.status(500).json({ error: "Erreur serveur" });
  }
}
