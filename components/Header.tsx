import { FaGear } from "react-icons/fa6";
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import React from "react";
import { useRouter } from "next/router";
import { useRotator } from "../providers/RotatorProvider";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { useSettings } from "@/providers/SettingsProvider";
import { FaPen } from "react-icons/fa6";
import { useGames } from "@/providers/GamesProvider";
import { FaPencil } from "react-icons/fa6";
import { ClickContainer } from "./ClickContainer";

export function Header() {
    const rotator = useRotator();
    const { setEditMode, editMode } = useGames();
    const { pathname } = useRouter();
    const { itemsHeight } = useSettings();
    const { showHeader, setShowHeader } = useSettings();

    React.useEffect(() => {
        // if escape is pressed, show the header
        const keydown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowHeader(!showHeader);
            }
        };
        document.addEventListener("keydown", keydown);
        return () => document.removeEventListener("keydown", keydown);
    }, [setShowHeader, showHeader]);

    return (
        <header
            style={{
                minHeight: showHeader || editMode ? itemsHeight + "px" : "0px",
                height: showHeader || editMode ? itemsHeight + "px" : "0px",
            }}>
            <ClickContainer className={"header-button"} action={rotator.rotate}>
                <FaArrowRotateRight size={"100%"} />
            </ClickContainer>
            <ClickContainer
                className={"header-button"}
                action={() => setShowHeader(!showHeader)}>
                {showHeader ? (
                    <FaEye size={"100%"} />
                ) : (
                    <FaEyeSlash size={"100%"} />
                )}
            </ClickContainer>
            <div
                style={{
                    float: "right",
                    height: "100%",
                }}>
                {pathname === "/" ? (
                    <ClickContainer
                        className={"header-button"}
                        action={() => setEditMode(!editMode)}>
                        {editMode ? (
                            <FaPencil size={"100%"} />
                        ) : (
                            <FaPen size={"100%"} />
                        )}
                    </ClickContainer>
                ) : null}
                {pathname !== "/" ? (
                    <ClickContainer className={"header-button"} action={"/"}>
                        <FaHouse size={"100%"} />
                    </ClickContainer>
                ) : (
                    <ClickContainer
                        className={"header-button"}
                        action={"/settings"}>
                        <FaGear size={"100%"} />
                    </ClickContainer>
                )}
            </div>
        </header>
    );
}
