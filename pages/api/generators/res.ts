// Nom du fichier : /pages/api/generators/all.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    // Utilisation de DELETE pour la suppression
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Suppression de tous les générateurs
    const result = await prisma.generator.deleteMany();

    if (result.count === 0) {
      return res.status(404).json({ message: "Aucun générateur à supprimer." });
    }

    res
      .status(200)
      .json({ success: "Tous les générateurs ont été supprimés." });
  } catch (error) {
    console.error("Erreur lors de la suppression des générateurs :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
