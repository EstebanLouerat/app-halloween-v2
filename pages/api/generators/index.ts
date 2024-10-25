// pages/api/settings/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export type DbdGenerator = {
  id: string;
  name: string;
  timeLeft: number;
  settingsName?: string;
  settings?: {
    id: string;
    alias: string;
    timerDuration: number;
    killerTimerDuration: number;
    killerCooldown: number;
    playerTimerRate: number[];
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const generator = await prisma.generator.findMany();
      res.status(200).json(generator);
    } catch (error) {
      res.status(500).json({ error: "Error fetching generators" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
