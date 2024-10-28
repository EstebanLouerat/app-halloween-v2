// pages/api/settings/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export type DbdGenerator = {
  id: string;
  name: string;
  timeLeft: number;
  isActif: boolean;
  settingsName: string;
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
  } else if (req.method === "PUT") {
    const { id, name, timeLeft, settings, settingsName, isActif } = req.body;
    try {
      const generator = await prisma.generator.update({
        where: { id: id },
        data: {
          name,
          timeLeft,
          settingsName,
          isActif,
        },
      });
      res.status(200).json(generator);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error updating generator with id: ${id}` });
    }
  } else if (req.method === "POST") {
    const { name, settingsName } = req.body;

    try {
      const settings = await prisma.settings.findUnique({
        where: { alias: settingsName },
      });

      if (!settings) {
        return res
          .status(404)
          .json({ error: `Settings with alias ${settingsName} not found.` });
      }

      const generator = await prisma.generator.create({
        data: {
          name,
          timeLeft: settings.timerDuration,
          isActif: false,
          settingsName: settings.alias,
        },
      });

      res.status(201).json(generator);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error creating generator", details: error });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query as { id: string };
    try {
      const generator = await prisma.generator.delete({
        where: { id: id },
      });
      res.status(200).json(generator);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Error deleting generator with id: ${id}` });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
