import { GetServerSideProps } from "next";
import Main from "../../components/Main";
import prisma from "@/lib/prisma";
import { DbdGenerator } from "../api/generators";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const generator = await prisma.generator.findUnique({
    where: { id: id },
    include: { settings: true },
  });

  if (!generator) {
    return {
      notFound: true,
    };
  }

  return {
    props: { ...generator },
  };
};

const Generator = (props: DbdGenerator) => {
  return (
    <>
      <Main {...props} />
    </>
  );
};

export default Generator;
