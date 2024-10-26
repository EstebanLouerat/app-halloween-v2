import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { DbdGenerator } from "../api/generators";
import Menu from "@/components/Menu";

export const getServerSideProps: GetServerSideProps = async () => {
  const generators = await prisma.generator.findMany({
    include: { settings: true },
  });

  return {
    props: { ...generators },
  };
};

export default function MenuGenerator(props: DbdGenerator[]) {
  return (
    <>
      <Menu generators={props} />
    </>
  );
}
