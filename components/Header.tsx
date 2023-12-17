import { FaGear } from "react-icons/fa6";
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaHouse } from "react-icons/fa6";
import { Button } from "./HeaderButton";
import React from "react";
import { useRouter } from "next/router";
import { useRotator } from "./Rotator";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";

export function Header() {
    const rotator = useRotator();
    const { pathname } = useRouter();
    const height = 125;
    const [autoHide, _setAutoHide] = React.useState<boolean>(false);
    const [show, setShow] = React.useState<boolean>(!autoHide);
    const showTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const setAutoHide = (value: boolean) => {
        _setAutoHide(value);
        if (!value) {
            setShow(true);
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
            }, 2000);
        };
        window.addEventListener("mousemove", onMouseMove);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, [autoHide]);

    return (
        <header
            style={{
                transition: "all 1s",
                height: show ? height + "px" : "0px",
                overflow: "hidden",
            }}>
            <Button id='rotate' onClick={rotator.rotate}>
                <FaArrowRotateRight size={"100%"} />
            </Button>
            <Button id='visibility' onClick={() => setAutoHide(!autoHide)}>
                {autoHide ? (
                    <FaEyeSlash size={"100%"} />
                ) : (
                    <FaEye size={"100%"} />
                )}
            </Button>
            <div
                style={{
                    float: "right",
                    height: "100%",
                }}>
                {pathname === "/settings" ? (
                    <Button id='home' onClick={"/"}>
                        <FaHouse size={"100%"} />
                    </Button>
                ) : (
                    <Button id='settings' onClick={"/settings"}>
                        <FaGear size={"100%"} />
                    </Button>
                )}
            </div>
        </header>
    );
}
