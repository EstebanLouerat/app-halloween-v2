import { GetServerSideProps } from "next";
import Main from "../../components/Main";
import prisma from "@/lib/prisma";
import { DbdGenerator } from "../api/generators";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  clearGeneratorFromLocalStorage,
  clearTimerFromLocalStorage,
} from "@/utils/localStorage";
import { DbdSetting } from "../api/settings";

export type MainProps = {
  generator: DbdGenerator;
  settings: DbdSetting;
  totalGen: number;
  totalGenDone: number;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  let totalGen = 0;
  let genDone = 0;

  // Récupérer tous les générateurs pour calculer les stats
  const generators = await prisma.generator.findMany({
    include: { settings: true },
  });

  if (!generators) {
    return {
      redirect: {
        destination: "/g",
        permanent: false,
      },
    };
  }

  // Trouver le générateur avec l'ID donné
  const generator = await prisma.generator.findUnique({
    where: { id: id },
    include: { settings: true },
  });

  if (!generator) {
    return {
      redirect: {
        destination: "/g",
        permanent: false,
      },
    };
  }

  const settings = await prisma.settings.findUnique({
    where: { alias: generator.settingsName },
  });

  // Calculer le nombre de générateurs et ceux qui sont terminés
  generators.forEach((g) => {
    totalGen++;
    if (g.timeLeft <= 0) genDone++;
  });

  const mainProps: MainProps = {
    generator: generator as DbdGenerator,
    settings: settings as DbdSetting,
    totalGen: totalGen,
    totalGenDone: genDone,
  };

  // Mettre à jour le générateur comme actif
  try {
    mainProps.generator = (await prisma.generator.update({
      where: { id: generator.id },
      data: {
        isActif: true,
      },
    })) as DbdGenerator;
  } catch (e) {
    return {
      redirect: {
        destination: "/g",
        permanent: false,
      },
    };
  }

  return {
    props: { ...mainProps },
  };
};

const Generator = (props: MainProps) => {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/g") {
      clearGeneratorFromLocalStorage();
      clearTimerFromLocalStorage();
    }
  }, [router]);

  return (
    <>
      <Main {...props} />
    </>
  );
};

export default Generator;
