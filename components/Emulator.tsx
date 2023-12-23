import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import Image from "next/image";

export type EmulatorProps = {
    name: string;
    icon?: string | React.ReactNode;
    path: string;
    args: string;
    style?: React.CSSProperties;
    onClick?: (() => void) | string;
};

export function Emulator(props: EmulatorProps) {
    const { name, icon, path, args } = props;
    const { itemsHeight, folderBarPlacement } = useSettings();
    return (
        <div
            className='emulator'
            style={{
                height: itemsHeight + "px",
                width: itemsHeight + "px",
                aspectRatio: "1",
            }}>
            <Image
                src={icon}
                alt={name}
                className='emulator-icon'
                width={itemsHeight}
                height={itemsHeight}
            />
        </div>
    );
}
