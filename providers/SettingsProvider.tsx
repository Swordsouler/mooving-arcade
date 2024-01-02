import React, { createContext, useState } from "react";

type FolderBarPlacement = "top" | "bottom" | "left" | "right";

type SettingsContextType = {
    itemsHeight: number;
    setItemsHeight: (value: number) => void;
    primaryColor: string;
    setPrimaryColor: (value: string) => void;
    secondaryColorIntensity: number;
    setSecondaryColorIntensity: (value: number) => void;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    folderBarPlacement: FolderBarPlacement;
    setFolderBarPlacement: (value: FolderBarPlacement) => void;
    showHeader: boolean;
    setShowHeader: (value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType>(
    {} as SettingsContextType
);

function SettingsProvider(props: { children: React.ReactNode }) {
    const { children } = props;
    const [itemsHeight, _setItemsHeight] = useState<number>(
        parseInt(localStorage.getItem("items-height") ?? "125")
    );
    const [primaryColor, _setPrimaryColor] = useState<string>(
        localStorage.getItem("primary-color") ?? "#FFFFFF"
    );
    const [secondaryColorIntensity, _setSecondaryColorIntensity] =
        useState<number>(
            parseInt(localStorage.getItem("secondary-color-intensity") ?? "100")
        );
    const [darkMode, _setDarkMode] = useState<boolean>(
        localStorage.getItem("dark-mode") !== "false"
    );
    const [folderBarPlacement, _setFolderBarPlacement] =
        useState<FolderBarPlacement>(
            (localStorage.getItem(
                "folder-bar-placement"
            ) as FolderBarPlacement) ?? "top"
        );
    const [showHeader, _setShowHeader] = useState<boolean>(
        localStorage.getItem("show-header") !== "false"
    );

    const setItemsHeight = (value: number) => {
        localStorage.setItem("items-height", value.toString());
        _setItemsHeight(value);
    };

    const setPrimaryColor = (value: string) => {
        localStorage.setItem("primary-color", value);
        _setPrimaryColor(value);
    };

    const setSecondaryColorIntensity = (value: number) => {
        localStorage.setItem("secondary-color-intensity", value.toString());
        _setSecondaryColorIntensity(value);
    };

    const setDarkMode = (value: boolean) => {
        localStorage.setItem("dark-mode", value.toString());
        _setDarkMode(value);
    };

    const setFolderBarPlacement = (value: FolderBarPlacement) => {
        localStorage.setItem("folder-bar-placement", value);
        _setFolderBarPlacement(value);
    };

    const setShowHeader = (value: boolean) => {
        localStorage.setItem("show-header", value.toString());
        _setShowHeader(value);
    };

    React.useEffect(() => {
        const applyColor = () => {
            document.documentElement.style.setProperty(
                "--color-primary",
                primaryColor
            );
            document.documentElement.style.setProperty(
                "--color-secondary",
                darkMode
                    ? darken(primaryColor, secondaryColorIntensity)
                    : ligthen(primaryColor, secondaryColorIntensity)
            );
        };
        applyColor();
    }, [primaryColor, secondaryColorIntensity, darkMode]);

    React.useEffect(() => {
        const applyItemsHeight = () => {
            document.documentElement.style.setProperty(
                "--item-height",
                itemsHeight + "px"
            );
        };
        applyItemsHeight();
    }, [itemsHeight]);

    React.useEffect(() => {
        const applyFolderBarPlacement = () => {
            document.documentElement.style.setProperty(
                "--home-flex-direction",
                folderBarPlacement === "bottom"
                    ? "column-reverse"
                    : folderBarPlacement === "left"
                    ? "row"
                    : folderBarPlacement === "right"
                    ? "row-reverse"
                    : "column"
            );
            document.documentElement.style.setProperty(
                "--emulators-padding",
                "calc(var(--item-height) / 8)"
            );
            document.documentElement.style.setProperty(
                "--emulator-padding-right",
                folderBarPlacement === "left" || folderBarPlacement === "right"
                    ? "0px"
                    : "var(--emulators-padding)"
            );
            document.documentElement.style.setProperty(
                "--emulator-padding-bottom",
                folderBarPlacement === "left" || folderBarPlacement === "right"
                    ? "var(--emulators-padding)"
                    : "0px"
            );
            document.documentElement.style.setProperty(
                "--emulators-item-height",
                "calc(var(--item-height) - 2 * var(--emulators-padding))"
            );
            document.documentElement.style.setProperty(
                "--emulators-width",
                folderBarPlacement === "left" || folderBarPlacement === "right"
                    ? "var(--emulators-item-height)"
                    : "calc(100% - 2 * var(--emulators-padding))"
            );
            document.documentElement.style.setProperty(
                "--emulators-height",
                folderBarPlacement === "left" || folderBarPlacement === "right"
                    ? "calc(100% - 2 * var(--emulators-padding))"
                    : "var(--emulators-item-height)"
            );
            document.documentElement.style.setProperty(
                "--emulators-flex-direction",
                folderBarPlacement === "left" || folderBarPlacement === "right"
                    ? "column"
                    : "row"
            );
            document.documentElement.style.setProperty(
                "--emulators-overflow-x",
                folderBarPlacement === "left" || folderBarPlacement === "right"
                    ? "hidden"
                    : "auto"
            );
            document.documentElement.style.setProperty(
                "--emulators-overflow-y",
                folderBarPlacement === "left" || folderBarPlacement === "right"
                    ? "auto"
                    : "hidden"
            );
        };
        applyFolderBarPlacement();
    }, [folderBarPlacement, showHeader]);

    return (
        <SettingsContext.Provider
            value={{
                itemsHeight,
                setItemsHeight,
                primaryColor,
                setPrimaryColor,
                secondaryColorIntensity,
                setSecondaryColorIntensity,
                darkMode,
                setDarkMode,
                folderBarPlacement,
                setFolderBarPlacement,
                showHeader,
                setShowHeader,
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

const darken = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = ((num >> 8) & 0x00ff) - amt,
        B = (num & 0x0000ff) - amt;
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
