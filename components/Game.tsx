import Image from "next/image";
import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import { FaQuestion, FaRegStar, FaStar } from "react-icons/fa6";
import { Icon } from "./Icon";
import { ClickContainer } from "./ClickContainer";
import { useGames } from "@/providers/GamesProvider";

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

export function Game(props: GameProps) {
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
        if (gameElement) {
            gameElement.scrollIntoView({ behavior: "smooth" });
        }
    }, [id, selected]);

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
                        <Image
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
}
