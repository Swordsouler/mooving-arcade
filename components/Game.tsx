import Image from "next/image";
import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import { FaQuestion, FaRegStar, FaStar } from "react-icons/fa6";
import { Icon } from "./Icon";
import { ClickContainer } from "./ClickContainer";
import { useGames } from "@/providers/GamesProvider";
import { useRotator } from "@/providers/RotatorProvider";

export type GameProps = {
    id?: number;
    name: string;
    path?: string;
    icon?: string | React.ReactNode;
    favorite?: boolean;
    emulator?: string;
    onClick?: (() => void) | string;
    style?: React.CSSProperties;
    selected?: boolean;
};

export const Game = React.memo(
    (props: GameProps) => {
        const {
            id = -1,
            name,
            icon = FaQuestion,
            emulator = "",
            path = "",
            favorite = false,
            style,
            selected = false,
        } = props;
        const { emulators, launchProcess, toggleFavoriteGame, editMode } =
            useGames();
        const { angle } = useRotator();
        const { itemsHeight } = useSettings();
        const onClick = React.useMemo(() => {
            if (props.onClick === undefined)
                return () => {
                    const emulator = emulators.filter(
                        (emulator) => emulator.name === props.emulator
                    )[0];
                    launchProcess(
                        path,
                        emulator.path ?? "",
                        emulator.args ?? "",
                        emulator.launchDirectoryPath
                    );
                };
            return props.onClick;
        }, [emulators, launchProcess, path, props.emulator, props.onClick]);

        const emulatorIcon = React.useMemo<string>(() => {
            if (!props.emulator) return "";
            const emulator = emulators.filter(
                (emulator) => emulator.name === props.emulator
            )[0];
            return emulator?.icon?.toString() ?? "";
        }, [emulators, props.emulator]);

        React.useEffect(() => {
            if (!selected) return;
            const gameElement = document.getElementById(`game-${id}`);
            const gamesDiv = document.getElementById("games");
            if (gameElement && gamesDiv) {
                const rect = gameElement.getBoundingClientRect();
                const gamesRect = gamesDiv.getBoundingClientRect();
                let top, bottom, isVisible;
                const rotation = angle % 360;

                // Déterminer la direction du défilement en fonction de l'angle de rotation
                switch (rotation) {
                    case 0:
                        top = rect.top - gamesRect.top;
                        bottom = top + rect.height;
                        isVisible = top >= 0 && bottom <= gamesRect.height;
                        break;
                    case 90:
                        top = gamesRect.right - rect.right;
                        bottom = top + rect.width;
                        isVisible = top >= 0 && bottom <= gamesRect.width;
                        break;
                    case 180:
                        top = gamesRect.bottom - rect.bottom;
                        bottom = top + rect.height;
                        isVisible = top >= 0 && bottom <= gamesRect.height;
                        break;
                    case 270:
                        top = rect.left - gamesRect.left;
                        bottom = top + rect.width;
                        isVisible = top >= 0 && bottom <= gamesRect.width;
                        break;
                    default:
                        return;
                }

                if (!isVisible) {
                    if (top < 0) {
                        // Le jeu est au-dessus de la zone visible, faire défiler jusqu'au haut du jeu
                        gamesDiv.scrollTo({
                            top: gamesDiv.scrollTop + top,
                            behavior: "smooth",
                        });
                    } else {
                        // Le jeu est en dessous de la zone visible, faire défiler jusqu'au bas du jeu
                        gamesDiv.scrollTo({
                            top:
                                gamesDiv.scrollTop +
                                bottom -
                                (rotation === 90 || rotation === 270
                                    ? gamesRect.width
                                    : gamesRect.height),
                            behavior: "smooth",
                        });
                    }
                }
            }
        }, [id, selected, itemsHeight, angle]);

        const action = React.useMemo<(() => void) | string>(() => {
            if (editMode && typeof onClick === "function") {
                const { name, icon, path, emulator } = props;
                const params = {
                    edit: true,
                    name,
                    icon,
                    path,
                    emulator,
                };

                const queryString = Object.entries(params)
                    .filter(([key, value]) => value != null)
                    .map(([key, value]) => {
                        let stringValue;
                        if (
                            typeof value === "string" ||
                            typeof value === "number" ||
                            typeof value === "boolean"
                        ) {
                            stringValue = String(value);
                        } else {
                            stringValue = JSON.stringify(value);
                        }
                        return `${key}=${stringValue}`;
                    })
                    .join("&");

                return `/add-game?${queryString}`;
            } else {
                return onClick;
            }
        }, [editMode, onClick, props]);

        return (
            <ClickContainer
                id={`game-${id}`}
                action={action}
                className={"game" + (selected ? " selected" : "")}
                style={style}>
                <div className='icon'>
                    {emulatorIcon !== "" && (
                        <div className='emulator-icon'>
                            <Icon
                                src={emulatorIcon}
                                alt={name}
                                width={100}
                                height={100}
                            />
                        </div>
                    )}
                    <Icon
                        src={icon}
                        alt={name}
                        className='game-icon'
                        width={itemsHeight}
                        height={itemsHeight}
                    />
                </div>
                <div className='name'>
                    <p className='game-name'>{name}</p>
                    <p className='emulator-name'>{emulator}</p>
                </div>
                {typeof action === "function" &&
                    (favorite ? (
                        <FaStar
                            className='star'
                            onClick={(e: React.MouseEvent) => {
                                if (editMode) return;
                                e.stopPropagation();
                                toggleFavoriteGame(name, emulator ?? "");
                            }}
                        />
                    ) : (
                        <FaRegStar
                            className='star'
                            onClick={(e: React.MouseEvent) => {
                                if (editMode) return;
                                e.stopPropagation();
                                toggleFavoriteGame(name, emulator ?? "");
                            }}
                        />
                    ))}
            </ClickContainer>
        );
    },
    (prevProps, nextProps) =>
        prevProps.selected === nextProps.selected &&
        prevProps.favorite === nextProps.favorite
);
