import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma"; // fichier prisma.ts à créer pour réutiliser le client

export type DbdSetting = {
  id: string;
  alias: string;
  timerDuration: number;
  killerTimerDuration: number;
  killerCooldown: number;
  playerTimerRate: number[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const settings = await prisma.settings.findFirst();
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: "Error fetching settings" });
    }
  } else if (req.method === "PUT") {
    const {
      timerDuration,
      killerTimerDuration,
      killerCooldown,
      playerTimerRate,
    } = req.body;
    try {
      const settings = await prisma.settings.update({
        where: { id: "cm2mav96k0000du2v9d6il0zg" }, // Assure-toi que ton ID est correct
        data: {
          timerDuration,
          killerTimerDuration,
          killerCooldown,
          playerTimerRate,
        },
      });
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: "Error updating settings" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
