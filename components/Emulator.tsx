import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import { Icon } from "./Icon";
import { ClickContainer } from "./ClickContainer";
import { useGames } from "@/providers/GamesProvider";

export type EmulatorProps = {
    name: string;
    icon?: string | React.ReactNode;
    path?: string;
    args?: string;
    gameDirectoryPath?: string;
    launchDirectoryPath?: string;
    imageDirectoryPath?: string;
    extension?: string;
    style?: React.CSSProperties;
    onClick?: (() => void) | string;
    selected?: boolean;
};

export function Emulator(props: EmulatorProps) {
    const { name, icon, style, onClick = () => {}, selected = false } = props;
    const { itemsHeight } = useSettings();
    const { editMode } = useGames();

    const action = React.useMemo<(() => void) | string>(() => {
        if (editMode && typeof onClick === "function" && name !== "Favoris") {
            const {
                name,
                icon,
                path,
                args,
                gameDirectoryPath,
                launchDirectoryPath,
                imageDirectoryPath,
                extension,
            } = props;
            const params = {
                edit: true,
                name,
                icon,
                path,
                args,
                gameDirectoryPath,
                launchDirectoryPath,
                imageDirectoryPath,
                extension,
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
                        // Convertir les autres types en chaîne ici
                        // Vous devrez peut-être ajuster cette partie en fonction de vos besoins
                        stringValue = JSON.stringify(value);
                    }
                    return `${key}=${encodeURIComponent(stringValue)}`;
                })
                .join("&");

            return `/add-emulator?${queryString}`;
        } else {
            return onClick;
        }
    }, [editMode, name, onClick, props]);

    return (
        <ClickContainer
            action={action}
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
