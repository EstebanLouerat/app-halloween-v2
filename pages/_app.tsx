import { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getGeneratorFromLocalStorage } from "@/utils/localStorage";
import { NotificationProvider } from "@/contexts/NotificationContext";
import MyNotification from "@/components/Notification";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    const generatorId = getGeneratorFromLocalStorage();
    if (generatorId && !pathname.includes("/g/[id]/settings")) {
      router.push(`/g/${generatorId}`);
    }
  }, []);

  return (
    <NotificationProvider>
      <Layout>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
        <MyNotification />
      </Layout>
    </NotificationProvider>
  );
};

export default App;
