import { Emulator } from "@/components/Emulator";
import { Game } from "@/components/Game";
import { useGames } from "@/providers/GamesProvider";
import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import { FaPlus } from "react-icons/fa6";

const Home = () => {
    const { games, emulators, currentEmulator, editMode } = useGames();
    const { itemsHeight, folderBarPlacement } = useSettings();

    const currentGames = React.useMemo(() => {
        return games.filter(
            (game) => game.emulator === emulators[currentEmulator].name
        );
    }, [currentEmulator, emulators, games]);

    return (
        <main
            style={{
                display: "flex",
                flex: 1,
                gap: "20px",
                flexDirection:
                    folderBarPlacement === "bottom"
                        ? "column-reverse"
                        : folderBarPlacement === "left"
                        ? "row"
                        : folderBarPlacement === "right"
                        ? "row-reverse"
                        : "column",
            }}>
            <div
                className='emulators'
                style={{
                    padding: itemsHeight / 8 + "px",
                    width:
                        folderBarPlacement === "left" ||
                        folderBarPlacement === "right"
                            ? itemsHeight + "px"
                            : "100%",
                    height:
                        folderBarPlacement === "left" ||
                        folderBarPlacement === "right"
                            ? "calc(100vh - " + itemsHeight + "px)"
                            : itemsHeight + "px",
                    flexDirection:
                        folderBarPlacement === "left" ||
                        folderBarPlacement === "right"
                            ? "column"
                            : "row",
                    overflowX:
                        folderBarPlacement === "left" ||
                        folderBarPlacement === "right"
                            ? "hidden"
                            : "auto",
                    overflowY:
                        folderBarPlacement === "left" ||
                        folderBarPlacement === "right"
                            ? "auto"
                            : "hidden",
                }}>
                <Emulator
                    style={{
                        height: editMode ? itemsHeight + "px" : "0px",
                    }}
                    name={"Ajouter un jeu"}
                    icon={FaPlus}
                    onClick={"/add-game"}
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://www.vectorlogo.zone/logos/google/google-icon.svg"
                    }
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                    }
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                    }
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                    }
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                    }
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                    }
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                    }
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                    }
                    path={""}
                    args={""}
                />
                <Emulator
                    name={""}
                    icon={
                        "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                    }
                    path={""}
                    args={""}
                />
            </div>
            <div className='games'>
                <Game
                    style={{
                        height: editMode ? itemsHeight + "px" : "0px",
                    }}
                    name={"Ajouter un jeu"}
                    icon={FaPlus}
                    onClick={"/add-game"}
                />
                {currentGames.map((game, index) => {
                    return <Game key={index} {...game} />;
                })}
            </div>
        </main>
    );
};

export default Home;
