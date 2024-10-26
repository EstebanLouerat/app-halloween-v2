import { GetServerSideProps } from "next";
import Main from "../../components/Main";
import prisma from "@/lib/prisma";
import { DbdGenerator } from "../api/generators";

export type MainProps = {
  generator: DbdGenerator;
  totalGen: number;
  totalGenDone: number;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  let totalGen = 0;
  let genDone = 0;
  const generators = await prisma.generator.findMany({
    include: { settings: true },
  });

  if (!generators) {
    return {
      props: {},
    };
  }

  const generator = generators.find((g) => g.id == id) as DbdGenerator;

  if (!generator) {
    return {
      notFound: true,
    };
  }

  generators.map((g) => {
    totalGen++;
    if (g.timeLeft <= 0) genDone++;
  });

  const mainProps: MainProps = {
    generator: generator,
    totalGen: totalGen,
    totalGenDone: genDone,
  };

  try {
    mainProps.generator = (await prisma.generator.update({
      where: { id: generator.id },
      data: {
        isActif: true,
      },
    })) as DbdGenerator;
  } catch (e) {
    return { notFound: true };
  }

  return {
    props: { ...mainProps },
  };
};

const Generator = (props: MainProps) => {
  return (
    <>
      <Main {...props} />
    </>
  );
};

export default Generator;
