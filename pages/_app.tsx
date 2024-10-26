import { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";
import Layout from "@/components/Layout";
import { ActiveGeneratorProvider, useActiveGenerator } from "@/contexts/ActiveGeneratorContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  // const { activeGeneratorId } = useActiveGenerator();

  // useEffect(() => {
  //   if (activeGeneratorId) {
  //     router.push(`/g/${activeGeneratorId}`);
  //   }
  // }, [activeGeneratorId, router]);
  return (
    <ActiveGeneratorProvider>
      <Layout>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </ActiveGeneratorProvider>
  );
};

export default App;
