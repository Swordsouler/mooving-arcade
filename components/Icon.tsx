import Image from "next/image";
import React from "react";
import { FaQuestion } from "react-icons/fa6";

export type IconProps = {
    src?: string | React.ReactNode;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
};

export function Icon(props: IconProps) {
    const {
        src = FaQuestion,
        alt = "",
        width = 100,
        height = 100,
        className = "",
        style,
    } = props;

    if (!src) return null;
    if (typeof src === "string") {
        return (
            <Image
                src={src}
                alt={alt}
                className={className}
                width={width}
                height={height}
                style={style}
            />
        );
    } else {
        return src(props);
    }
}
