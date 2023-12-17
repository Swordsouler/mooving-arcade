import { RotatorProvider } from "@/components/Rotator";
import { Controller } from "@/utilities/gamepad";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import "@/styles/globals.css";
import { Header } from "@/components/Header";

export default function MyApp(props: AppProps) {
    return <App {...props} />;
}

const App = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        Controller.init();
    }, []);
    return (
        <RotatorProvider>
            <Head>
                <title>Mooving Arcade</title>
            </Head>
            <Header />
            <Component {...pageProps} />
        </RotatorProvider>
    );
};
