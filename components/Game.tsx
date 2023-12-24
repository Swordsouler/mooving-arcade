import Image from "next/image";
import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import { FaQuestion } from "react-icons/fa6";
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
    const { emulators, setCurrentGame, launchGame } = useGames();
    const { itemsHeight } = useSettings();
    const onClick = React.useMemo(() => {
        if (props.onClick === undefined)
            return () => {
                const emulator = emulators.filter(
                    (emulator) => emulator.name === props.emulator
                )[0];
                setCurrentGame(id);
                launchGame(
                    path,
                    emulator.path ?? "",
                    emulator.args ?? "",
                    emulator.launchDirectoryPath
                );
            };
        return props.onClick;
    }, [
        emulators,
        id,
        launchGame,
        path,
        props.emulator,
        props.onClick,
        setCurrentGame,
    ]);

    return (
        <ClickContainer
            action={onClick}
            className={"game" + (selected ? " selected" : "")}
            style={style}>
            <div className='icon'>
                {emulator !== "" && (
                    <div className='emulator-icon'>
                        <Image
                            src={
                                "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                            }
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
        </ClickContainer>
    );
}
