import React, { createContext, useState } from "react";

type FolderBarPlacement = "top" | "bottom" | "left" | "right";

type SettingsContextType = {
    headerHeight: number;
    setHeaderHeight: (value: number) => void;
    primaryColor: string;
    setPrimaryColor: (value: string) => void;
    secondaryColorIntensity: number;
    setSecondaryColorIntensity: (value: number) => void;
    folderBarPlacement: FolderBarPlacement;
    setFolderBarPlacement: (value: FolderBarPlacement) => void;
};

const SettingsContext = createContext<SettingsContextType>(
    {} as SettingsContextType
);

function SettingsProvider(props: { children: React.ReactNode }) {
    const { children } = props;
    const [headerHeight, _setHeaderHeight] = useState<number>(
        Number(localStorage.getItem("header-height")) | 125
    );
    const [primaryColor, _setPrimaryColor] = useState<string>(
        localStorage.getItem("primary-color") ?? "#0000FF"
    );
    const [secondaryColorIntensity, _setSecondaryColorIntensity] =
        useState<number>(
            Number(localStorage.getItem("secondary-color-intensity")) | 80
        );
    const [folderBarPlacement, _setFolderBarPlacement] =
        useState<FolderBarPlacement>(
            (localStorage.getItem(
                "folder-bar-placement"
            ) as FolderBarPlacement) ?? "top"
        );

    console.log("secondaryColorIntensity", secondaryColorIntensity);
    React.useEffect(() => {
        const applyColor = () => {
            document.documentElement.style.setProperty(
                "--color-primary",
                primaryColor
            );
            document.documentElement.style.setProperty(
                "--color-secondary",
                ligthen(primaryColor, secondaryColorIntensity)
            );
        };
        applyColor();
    }, [primaryColor, secondaryColorIntensity]);

    const setHeaderHeight = (value: number) => {
        localStorage.setItem("header-height", value.toString());
        _setHeaderHeight(value);
    };

    const setPrimaryColor = (value: string) => {
        localStorage.setItem("primary-color", value);
        _setPrimaryColor(value);
    };

    const setSecondaryColorIntensity = (value: number) => {
        localStorage.setItem("secondary-color-intensity", value.toString());
        _setSecondaryColorIntensity(value);
    };

    const setFolderBarPlacement = (value: FolderBarPlacement) => {
        localStorage.setItem("folder-bar-placement", value);
        _setFolderBarPlacement(value);
    };

    return (
        <SettingsContext.Provider
            value={{
                headerHeight,
                setHeaderHeight,
                primaryColor,
                setPrimaryColor,
                secondaryColorIntensity,
                setSecondaryColorIntensity,
                folderBarPlacement,
                setFolderBarPlacement,
            }}>
            {children}
        </SettingsContext.Provider>
    );
}

const useSettings = (): SettingsContextType => {
    return React.useContext(SettingsContext);
};

export { SettingsContext, SettingsProvider, useSettings };

const ligthen = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = ((num >> 8) & 0x00ff) + amt,
        B = (num & 0x0000ff) + amt;
    return (
        "#" +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
};
