import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import Link from "next/link";

export type ClickContainerProps = {
    children: React.ReactNode;
    action: (() => void) | string;
    style?: React.CSSProperties;
    className?: string;
    id?: string;
};

export const ClickContainer = (props: ClickContainerProps) => {
    const { children, action, style, className, id } = props;

    if (typeof action === "string") {
        return (
            <Link
                id={id}
                className={className}
                href={action}
                style={{
                    textDecoration: "none",
                    ...style,
                }}>
                {children}
            </Link>
        );
    } else {
        return (
            <div className={className} onClick={action} style={style} id={id}>
                {children}
            </div>
        );
    }
};
