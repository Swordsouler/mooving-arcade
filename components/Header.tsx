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

export function Header() {
    const rotator = useRotator();
    const { pathname } = useRouter();
    const { headerHeight } = useSettings();
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
                height: show ? headerHeight + "px" : "0px",
                overflow: "hidden",
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
                {pathname === "/settings" ? (
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
