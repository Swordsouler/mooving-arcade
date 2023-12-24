import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import { Icon } from "./Icon";
import { ClickContainer } from "./ClickContainer";

export type EmulatorProps = {
    name: string;
    icon?: string | React.ReactNode;
    path?: string;
    args?: string;
    gameDirectoryPath?: string;
    launchDirectoryPath?: string;
    imageDirectoryPath?: string;
    style?: React.CSSProperties;
    onClick?: (() => void) | string;
    selected?: boolean;
};

export function Emulator(props: EmulatorProps) {
    const { name, icon, style, onClick = () => {}, selected = false } = props;
    const { itemsHeight } = useSettings();
    return (
        <ClickContainer
            action={onClick}
            className={"emulator" + (selected ? " selected" : "")}
            style={style}>
            <Icon
                src={icon}
                alt={name}
                className='emulator-icon'
                width={itemsHeight}
                height={itemsHeight}
            />
        </ClickContainer>
    );
}
