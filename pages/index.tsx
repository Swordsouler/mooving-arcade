import { Emulator } from "@/components/Emulator";
import { Game } from "@/components/Game";
import { useGamepad } from "@/providers/GamepadProvider";
import { useGames } from "@/providers/GamesProvider";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import Image from "next/image";

const Home = () => {
    const {
        games,
        emulators,
        currentEmulator,
        setCurrentEmulator,
        killProcess,
        pidProcess,
        lockMode,
        editMode,
    } = useGames();
    const { currentGame, setCurrentGame } = useGamepad();
    const background = React.useMemo(() => {
        //type of string
        if (
            games[currentGame] &&
            games[currentGame].icon &&
            typeof games[currentGame].icon === "string"
        ) {
            return games[currentGame].icon?.toString();
        }
        return "";
    }, [games, currentGame]);

    React.useEffect(() => {
        // lorsqu'on appuis sur une lettre ou un chiffre du clavier, on sélectionne le premier jeu qui commence par cette lettre ou ce chiffre
        // si on appuis sur une lettre ou un chiffre qui n'est pas associé à un jeu, on ne fait rien
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.length === 1) {
                const index = games.findIndex((game) => {
                    return game.name[0].toLowerCase() === e.key.toLowerCase();
                });
                if (index !== -1) {
                    setCurrentGame(index);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [games, setCurrentGame]);

    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
        setHasError(false); // réinitialiser l'état d'erreur lorsque l'arrière-plan change
    }, [background]);

    return (
        <main className='home'>
            {!hasError && background?.toString() && (
                <Image
                    id='background'
                    alt='background'
                    width={100}
                    height={100}
                    src={background?.toString() ?? ""}
                    onError={(e) => {
                        setHasError(true);
                    }}
                />
            )}
            {(pidProcess !== -1 || lockMode) && (
                <div
                    onClick={killProcess}
                    id='kill-process'
                    className='overlay'
                    style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                    <FaPlus className='kill-button' />
                </div>
            )}
            <div className='emulators'>
                <Emulator
                    style={{
                        width: editMode ? undefined : "0px",
                        height: editMode ? undefined : "0px",
                        paddingRight: editMode ? undefined : "0px",
                        paddingBottom: editMode ? undefined : "0px",
                    }}
                    name={"Ajouter un émulateur"}
                    icon={FaPlus}
                    onClick={"/add-emulator"}
                />
                <Emulator
                    name={"Favoris"}
                    icon={FaStar}
                    selected={currentEmulator === -1}
                    onClick={() => {
                        setCurrentEmulator(-1);
                    }}
                />
                {emulators.map((emulator, index) => {
                    return (
                        <Emulator
                            key={index}
                            selected={index === currentEmulator}
                            {...emulator}
                            onClick={() => {
                                setCurrentEmulator(index);
                            }}
                        />
                    );
                })}
            </div>
            <div className='games' id='games'>
                <Game
                    style={{
                        height: editMode ? undefined : "0px",
                        minHeight: editMode ? undefined : "0px",
                        maxHeight: editMode ? undefined : "0px",
                    }}
                    name={"Ajouter un jeu"}
                    icon={FaPlus}
                    onClick={"/add-game"}
                />
                {games.map((game, index) => {
                    return (
                        <Game
                            key={game.name + "-" + game.emulator}
                            id={index}
                            {...game}
                            selected={index === currentGame}
                        />
                    );
                })}
            </div>
        </main>
    );
};

export default Home;
