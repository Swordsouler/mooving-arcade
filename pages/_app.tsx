import "@/styles/add.css";
import "@/styles/emulator.css";
import "@/styles/game.css";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/home.css";
import "@/styles/settings.css";
import { RotatorProvider } from "@/providers/RotatorProvider";
import { Controller } from "@/utilities/gamepad";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Header } from "@/components/Header";
import React from "react";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { GamesProvider } from "@/providers/GamesProvider";
import { GamepadProvider } from "@/providers/GamepadProvider";

export default function MyApp(props: AppProps) {
    const [loaded, setLoaded] = React.useState<boolean>(false);
    React.useEffect(() => {
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
    React.useEffect(() => {
        Controller.init();
    }, []);
    return (
        <RotatorProvider>
            <SettingsProvider>
                <GamesProvider>
                    <Head>
                        <title>Mooving Arcade</title>
                    </Head>
                    <Header />
                    <Component {...pageProps} />
                </GamesProvider>
            </SettingsProvider>
        </RotatorProvider>
    );
};
