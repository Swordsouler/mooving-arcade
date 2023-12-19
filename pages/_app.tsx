import { RotatorProvider } from "@/providers/RotatorProvider";
import { Controller } from "@/utilities/gamepad";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import "@/styles/globals.css";
import { Header } from "@/components/Header";
import React from "react";
import { SettingsProvider } from "@/providers/SettingsProvider";

export default function MyApp(props: AppProps) {
    const [loaded, setLoaded] = React.useState<boolean>(false);
    useEffect(() => {
        fetch("RetroGaming.ttf")
            .then((response) => response.arrayBuffer())
            .then((fontData) => {
                const font = new FontFace("RetroGaming", fontData);
                return font.load();
            })
            .then((font) => {
                document.fonts.add(font);
                document.body.style.fontFamily = "RetroGaming, sans-serif";
            })
            .catch(console.error);
        setLoaded(true);
    }, []);
    if (!loaded) return null;
    return <App {...props} />;
}

const App = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        Controller.init();
    }, []);
    return (
        <SettingsProvider>
            <RotatorProvider>
                <Head>
                    <title>Mooving Arcade</title>
                </Head>
                <Header />
                <Component {...pageProps} />
            </RotatorProvider>
        </SettingsProvider>
    );
};
