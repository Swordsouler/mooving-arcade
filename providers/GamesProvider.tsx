import { EmulatorProps } from "@/components/Emulator";
import { GameProps } from "@/components/Game";
import React from "react";

type GamesContextType = {
    allGames: GameProps[];
    games: GameProps[];
    setGames: (games: GameProps[]) => void;
    toggleFavoriteGame: (name: string, emulator: string) => void;
    emulators: EmulatorProps[];
    setEmulators: (emulators: EmulatorProps[]) => void;
    currentEmulator: number;
    setCurrentEmulator: (currentEmulator: number) => void;

    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    lockMode: boolean;
    pidProcess: number;
    launchProcess: (
        gamePath: string,
        emulatorPath: string,
        args: string,
        launchDirectoryPath?: string
    ) => void;
    killProcess: () => void;
};

const GamesContext = React.createContext({} as GamesContextType);

function GamesProvider(props: { children: React.ReactNode }) {
    const { children } = props;
    const [allGames, _setGames] = React.useState<GameProps[]>([]);
    const [emulators, _setEmulators] = React.useState<EmulatorProps[]>([]);
    const [currentEmulator, setCurrentEmulator] = React.useState<number>(
        parseInt(localStorage.getItem("current-game") ?? "-1")
    );
    const [editMode, setEditMode] = React.useState<boolean>(false);
    const [pidProcess, setPidProcess] = React.useState<number>(-1);
    const [lockMode, setLockMode] = React.useState<boolean>(false);

    const games = React.useMemo(() => {
        if (currentEmulator === -1) {
            return allGames.filter(
                (game) => game.favorite !== undefined && game.favorite
            );
        }
        const emulatorName = emulators[currentEmulator]?.name;
        return allGames.filter((game) => game.emulator === emulatorName);
    }, [emulators, currentEmulator, allGames]);

    async function executePath(
        mainCommand: string,
        commandArgs: string,
        gamePath: string,
        launchDirectoryPath: string
    ) {
        if (!window.electron) return;
        const pid = await window.electron.invoke("execute-command", {
            mainCommand,
            commandArgs,
            gamePath,
            launchDirectoryPath,
        });
        return pid;
    }

    React.useEffect(() => {
        if (!window.electron) return;
        window.electron.on("process-exit", (pid: number) => {
            console.log(`Process ${pid} has exited`);
            setLockMode(false);
            setPidProcess(-1);
        });
        return () => {
            window.electron.removeAllListeners("process-exit");
        };
    }, []);

    async function launchProcess(
        gamePath: string,
        emulatorPath: string,
        args: string,
        launchDirectoryPath?: string
    ) {
        if (lockMode) return;
        setLockMode(true);
        const pid = await executePath(
            emulatorPath,
            args,
            gamePath,
            launchDirectoryPath ?? "c:/"
        );
        if (!pid) return;
        setPidProcess(pid);
    }

    const killProcess = () => {
        if (!window.electron) return;
        window.electron.invoke("kill-process", pidProcess);
        setPidProcess(-1);
    };

    const setGames = (games: GameProps[]) => {
        window.electron.writeFile("../games.json", JSON.stringify(games));
        _setGames(games);
    };

    const setEmulators = (emulators: EmulatorProps[]) => {
        window.electron.writeFile(
            "../emulators.json",
            JSON.stringify(emulators)
        );
        _setEmulators(emulators);
    };

    const toggleFavoriteGame = (name: string, emulator: string) => {
        const gameIndex = allGames.findIndex(
            (game) => game.name === name && game.emulator === emulator
        );
        if (gameIndex === -1) return;
        const game = allGames[gameIndex];
        game.favorite = !game.favorite;
        const newGames = [...allGames];
        newGames[gameIndex] = game;
        setGames(newGames);
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
                allGames,
                games,
                setGames,
                toggleFavoriteGame,
                emulators,
                setEmulators,
                currentEmulator,
                setCurrentEmulator,
                editMode,
                setEditMode,
                lockMode,
                pidProcess,
                launchProcess,
                killProcess,
            }}>
            {children}
        </GamesContext.Provider>
    );
}

const useGames = (): GamesContextType => {
    return React.useContext(GamesContext);
};

export { GamesContext, GamesProvider, useGames };
