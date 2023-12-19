import Link from "next/link";
import "./HeaderButton.css";
import React from "react";

type HeaderButtonProps = {
    children: React.ReactNode;
    onClick: (() => void) | string;
    id?: string;
};

export function HeaderButton(props: HeaderButtonProps) {
    const { children, onClick, id } = props;
    const size = 100;
    const style = {
        aspectRatio: 1,
        height: "calc(" + size + "% - " + (size / 10) * 2 + "px)",
        padding: size / 10,
    };

    if (typeof onClick === "string") {
        return (
            <Link
                id={id}
                href={onClick}
                className={"header-button"}
                style={style}>
                {children}
            </Link>
        );
    } else {
        return (
            <span
                tabIndex={0}
                id={id}
                onClick={onClick}
                className={"header-button"}
                style={style}>
                {children}
            </span>
        );
    }
}
