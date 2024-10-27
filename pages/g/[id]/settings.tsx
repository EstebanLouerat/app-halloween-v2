import { GetServerSideProps } from "next";
import Settings from "../../../components/Settings";
import prisma from "@/lib/prisma";
import { DbdSetting } from "@/pages/api/settings";
import { DbdGenerator } from "@/pages/api/generators";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const generator = await prisma.generator.findUnique({
    where: { id },
    include: {
      settings: true,
    },
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

export default function SettingsPage(props: DbdGenerator) {
  return <Settings {...props} />;
}
