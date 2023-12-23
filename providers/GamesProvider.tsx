import { EmulatorProps } from "@/components/Emulator";
import { GameProps } from "@/components/Game";
import React from "react";

type GamesContextType = {
    games: GameProps[];
    setGames: (games: GameProps[]) => void;
    currentGame: number;
    setCurrentGame: (currentGame: number) => void;
    emulators: EmulatorProps[];
    setEmulators: (emulators: EmulatorProps[]) => void;
    currentEmulator: number;
    setCurrentEmulator: (currentEmulator: number) => void;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
};

const GamesContext = React.createContext({} as GamesContextType);

function GamesProvider(props: { children: React.ReactNode }) {
    const { children } = props;
    const [games, _setGames] = React.useState<GameProps[]>([]);
    const [currentGame, _setCurrentGame] = React.useState<number>(
        Number(localStorage.getItem("current-game")) || 0
    );
    const [emulators, _setEmulators] = React.useState<EmulatorProps[]>([]);
    const [currentEmulator, _setCurrentEmulator] = React.useState<number>(
        Number(localStorage.getItem("current-emulator")) || 0
    );
    const [editMode, setEditMode] = React.useState<boolean>(false);

    const setGames = (games: GameProps[]) => {
        window.electron.writeFile("../games.json", JSON.stringify(games));
        _setGames(games);
    };

    const setCurrentGame = (currentGame: number) => {
        localStorage.setItem("current-game", currentGame.toString());
        _setCurrentGame(currentGame);
    };

    const setEmulators = (emulators: EmulatorProps[]) => {
        window.electron.writeFile(
            "../emulators.json",
            JSON.stringify(emulators)
        );
        _setEmulators(emulators);
    };

    const setCurrentEmulator = (currentEmulator: number) => {
        localStorage.setItem("current-emulator", currentEmulator.toString());
        _setCurrentEmulator(currentEmulator);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const gamesData = await window.electron.readFile(
                    "../games.json"
                );
                console.log("Reading games.json", gamesData);
                setGames(JSON.parse(gamesData));
            } catch (err) {
                console.error(err);
            }

            try {
                const emulatorsData = await window.electron.readFile(
                    "../emulators.json"
                );
                console.log("Reading emulators.json", emulatorsData);
                setEmulators(JSON.parse(emulatorsData));
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    return (
        <GamesContext.Provider
            value={{
                games,
                setGames,
                currentGame,
                setCurrentGame,
                emulators,
                setEmulators,
                currentEmulator,
                setCurrentEmulator,
                editMode,
                setEditMode,
            }}>
            {children}
        </GamesContext.Provider>
    );
}

const useGames = (): GamesContextType => {
    return React.useContext(GamesContext);
};

export { GamesContext, GamesProvider, useGames };
