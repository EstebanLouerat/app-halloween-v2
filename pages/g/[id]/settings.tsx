import { GetServerSideProps } from "next";
import Settings from "../../../components/Settings";
import prisma from "@/lib/prisma";
import { DbdSetting } from "@/pages/api/settings";

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
    props: { ...generator.settings },
  };
};

export default function SettingsPage(props: DbdSetting) {
  return <Settings {...props} />;
}
