import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import Link from "next/link";

export type ClickContainerProps = {
    children: React.ReactNode;
    action: (() => void) | string;
    style?: React.CSSProperties;
    className?: string;
};

export const ClickContainer = (props: ClickContainerProps) => {
    const { children, action, style, className } = props;

    if (typeof action === "string") {
        return (
            <Link
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
            <div className={className} onClick={action} style={style}>
                {children}
            </div>
        );
    }
};
