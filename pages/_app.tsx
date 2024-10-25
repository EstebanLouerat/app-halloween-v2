import { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";
import Layout from "@/components/Layout";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
