import { FaGear } from "react-icons/fa6";
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import { HeaderButton } from "./HeaderButton";
import React from "react";
import { useRouter } from "next/router";
import { useRotator } from "../providers/RotatorProvider";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { useSettings } from "@/providers/SettingsProvider";
import { FaPen } from "react-icons/fa6";
import { useGames } from "@/providers/GamesProvider";
import { FaPencil } from "react-icons/fa6";

export function Header() {
    const rotator = useRotator();
    const { setEditMode, editMode } = useGames();
    const { pathname } = useRouter();
    const { itemsHeight } = useSettings();
    const [autoHide, _setAutoHide] = React.useState<boolean>(
        localStorage.getItem("header-auto-hide") === "true"
    );
    const [show, setShow] = React.useState<boolean>(!autoHide);
    const showTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const setAutoHide = (value: boolean) => {
        localStorage.setItem("header-auto-hide", value.toString());
        _setAutoHide(value);
        setShow(!value);
        if (!value) {
            if (showTimeout.current) {
                clearTimeout(showTimeout.current);
            }
        }
    };

    React.useEffect(() => {
        // activate on mouse move
        const onMouseMove = () => {
            if (!autoHide) return;
            setShow(true);
            if (showTimeout.current) {
                clearTimeout(showTimeout.current);
            }
            showTimeout.current = setTimeout(() => {
                setShow(false);
            }, 1000);
        };
        window.addEventListener("mousemove", onMouseMove);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, [autoHide]);

    return (
        <header
            style={{
                transition: "all 0.5s",
                height: show ? itemsHeight + "px" : "0px",
                overflow: "hidden",
                boxShadow: "0px 0px 5px 0px var(--color-primary)",
            }}>
            <HeaderButton id='rotate' onClick={rotator.rotate}>
                <FaArrowRotateRight size={"100%"} />
            </HeaderButton>
            <HeaderButton
                id='visibility'
                onClick={() => setAutoHide(!autoHide)}>
                {autoHide ? (
                    <FaEyeSlash size={"100%"} />
                ) : (
                    <FaEye size={"100%"} />
                )}
            </HeaderButton>
            <div
                style={{
                    float: "right",
                    height: "100%",
                }}>
                {pathname === "/" ? (
                    <HeaderButton
                        id='edit'
                        onClick={() => setEditMode(!editMode)}>
                        {editMode ? (
                            <FaPencil size={"100%"} />
                        ) : (
                            <FaPen size={"100%"} />
                        )}
                    </HeaderButton>
                ) : null}
                {pathname !== "/" ? (
                    <HeaderButton id='home' onClick={"/"}>
                        <FaHouse size={"100%"} />
                    </HeaderButton>
                ) : (
                    <HeaderButton id='settings' onClick={"/settings"}>
                        <FaGear size={"100%"} />
                    </HeaderButton>
                )}
            </div>
        </header>
    );
}
