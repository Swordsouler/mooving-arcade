import { Emulator } from "@/components/Emulator";
import { Game } from "@/components/Game";
import { useGames } from "@/providers/GamesProvider";
import React from "react";
import { FaPlus } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";

const Home = () => {
    const {
        games,
        emulators,
        currentEmulator,
        setCurrentEmulator,
        killProcess,
        currentGame,
        pidProcess,
        lockMode,
        editMode,
    } = useGames();

    const currentGames = React.useMemo(() => {
        if (currentEmulator === -1) {
            return games.filter(
                (game) => game.favorite !== undefined && game.favorite
            );
        }
        return games.filter(
            (game) =>
                emulators[currentEmulator] &&
                game.emulator === emulators[currentEmulator].name
        );
    }, [currentEmulator, emulators, games]);

    return (
        <main className='home'>
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
            <div className='games'>
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
                {currentGames.map((game, index) => {
                    return (
                        <Game
                            key={index}
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
