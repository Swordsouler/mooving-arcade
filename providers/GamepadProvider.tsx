import React from "react";
import { useGames } from "./GamesProvider";

type Action =
    | "launch"
    | "close"
    | "next_emulator"
    | "previous_emulator"
    | "next_game"
    | "previous_game"
    | "toggle_favorite";

type Inputs = { [key in Action]: number[] };
type GamepadConfig = { delay: number; inputs: Inputs };

const defaultGamepadConfig: GamepadConfig = {
    delay: 200,
    inputs: {
        launch: [10],
        close: [9],
        next_emulator: [2],
        previous_emulator: [1],
        next_game: [6],
        previous_game: [5],
        toggle_favorite: [7],
    },
};

type GamepadContextType = {
    currentGame: number;
    setCurrentGame: (currentGame: number) => void;
};

const GamepadContext = React.createContext({} as GamepadContextType);

function GamepadProvider(props: { children: React.ReactNode }) {
    const { children } = props;
    const [gamepadConfig, setGamepadConfig] =
        React.useState<GamepadConfig>(defaultGamepadConfig);
    const [currentGame, setCurrentGame] = React.useState<number>(
        parseInt(localStorage.getItem("current-emulator") ?? "0")
    );
    const controllers = React.useRef<any[]>([]);
    const request = React.useRef<any>(null);
    const {
        launchProcess,
        killProcess,
        emulators,
        games,
        setGames,
        toggleFavoriteGame,
        setCurrentEmulator,
        currentEmulator,
        pidProcess,
    } = useGames();

    React.useEffect(() => {
        setCurrentGame(0);
    }, [currentEmulator]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const gamepadConfigJSON = await window.electron.readFile(
                    "../inputs.json"
                );
                const gamepadConfig: GamepadConfig =
                    JSON.parse(gamepadConfigJSON);
                console.log("Reading inputs.json", gamepadConfig);
                setGamepadConfig(gamepadConfig ?? defaultGamepadConfig);
            } catch (err) {
                console.error(err);
                if (!window.electron) return;
                window.electron.writeFile(
                    "../inputs.json",
                    JSON.stringify(defaultGamepadConfig)
                );
            }
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        const launchGame = () => {
            if (pidProcess !== -1) return;
            console.log("launching game");
            //get the emulator of the game
            const emulator = emulators.filter(
                (emulator) => emulator.name === games[currentGame].emulator
            )[0];
            launchProcess(
                games[currentGame].path ?? "",
                emulator.path ?? "",
                emulator.args ?? "",
                emulator.launchDirectoryPath ?? ""
            );
        };
        const closeGame = () => {
            console.log("closing game");
            killProcess();
        };
        const nextEmulator = () => {
            if (pidProcess !== -1) return;
            console.log("next emulator");
            //favorite emulator is -1 when no next emulator
            const nextEmulator = emulators[currentEmulator + 1];
            if (nextEmulator) {
                setCurrentEmulator(currentEmulator + 1);
            } else {
                setCurrentEmulator(-1);
            }
        };
        const previousEmulator = () => {
            if (pidProcess !== -1) return;
            console.log("previous emulator");
            //favorite emulator is -1 when no previous emulator
            const previousEmulator = emulators[currentEmulator - 1];
            if (previousEmulator) {
                setCurrentEmulator(currentEmulator - 1);
            } else {
                if (currentEmulator === -1)
                    setCurrentEmulator(emulators.length - 1);
                else setCurrentEmulator(-1);
            }
        };
        const nextGame = () => {
            if (pidProcess !== -1) return;
            console.log("next game");
            // between 0 and games.length - 1
            const nextGame = games[currentGame + 1];
            if (nextGame) {
                setCurrentGame(currentGame + 1);
            } else {
                setCurrentGame(0);
            }
        };
        const previousGame = () => {
            if (pidProcess !== -1) return;
            console.log("previous game");
            // between 0 and games.length - 1
            const previousGame = games[currentGame - 1];
            if (previousGame) {
                setCurrentGame(currentGame - 1);
            } else {
                setCurrentGame(games.length - 1);
            }
        };

        const toggleFavorite = () => {
            console.log("toggle favorite");
            const game = games[currentGame];
            toggleFavoriteGame(game.name, game.emulator ?? "");
        };

        function scanGamepads() {
            const gamepads = navigator.getGamepads();
            let gamepadID = 0;
            for (const gamepad of gamepads) {
                if (controllers.current[gamepadID] === undefined)
                    controllers.current[gamepadID] = {};

                if (gamepad) {
                    let buttonID = -1;
                    for (const button of gamepad.buttons) {
                        buttonID++;
                        if (
                            controllers.current[gamepadID][buttonID] ===
                            undefined
                        )
                            controllers.current[gamepadID][buttonID] = {};

                        if (button.pressed) {
                            if (
                                controllers.current[gamepadID][buttonID][
                                    "timeout"
                                ] !== undefined
                            )
                                continue;
                            console.log("timeout", gamepadID, buttonID);
                            const currentGamepadID = gamepadID;
                            const currentButtonID = buttonID;
                            controllers.current[gamepadID][buttonID][
                                "timeout"
                            ] = setTimeout(() => {
                                console.log(
                                    "clear timeout",
                                    currentGamepadID,
                                    currentButtonID
                                );
                                controllers.current[currentGamepadID][
                                    currentButtonID
                                ]["timeout"] = undefined;
                            }, gamepadConfig.delay);

                            // action of gamepadConfig.inputs
                            for (const action in gamepadConfig.inputs) {
                                const inputs =
                                    gamepadConfig.inputs[action as Action];
                                if (inputs.includes(buttonID + 1)) {
                                    switch (action) {
                                        case "launch":
                                            launchGame();
                                            break;
                                        case "close":
                                            closeGame();
                                            break;
                                        case "next_emulator":
                                            nextEmulator();
                                            break;
                                        case "previous_emulator":
                                            previousEmulator();
                                            break;
                                        case "next_game":
                                            nextGame();
                                            break;
                                        case "previous_game":
                                            previousGame();
                                            break;
                                        case "toggle_favorite":
                                            toggleFavorite();
                                            break;
                                    }
                                }
                            }
                        } else {
                            if (
                                controllers.current[gamepadID][buttonID][
                                    "timeout"
                                ] === undefined
                            )
                                continue;

                            console.log("clear timeout", gamepadID, buttonID);
                            clearTimeout(
                                controllers.current[gamepadID][buttonID][
                                    "timeout"
                                ]
                            );
                            controllers.current[gamepadID][buttonID][
                                "timeout"
                            ] = undefined;
                        }
                    }
                }
                gamepadID++;
            }
            request.current = window.requestAnimationFrame(scanGamepads);
        }

        console.log("starting gamepad");
        scanGamepads();

        return () => {
            cancelAnimationFrame(request.current);
        };
    }, [
        currentEmulator,
        currentGame,
        emulators,
        gamepadConfig.delay,
        gamepadConfig.inputs,
        games,
        killProcess,
        launchProcess,
        pidProcess,
        setCurrentEmulator,
        setGames,
        toggleFavoriteGame,
    ]);

    return (
        <GamepadContext.Provider
            value={{
                currentGame,
                setCurrentGame,
            }}>
            {children}
        </GamepadContext.Provider>
    );
}

const useGamepad = (): GamepadContextType => {
    return React.useContext(GamepadContext);
};

export { GamepadContext, GamepadProvider, useGamepad };
