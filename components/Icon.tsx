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
    const [icon, setIcon] = React.useState<string | React.ReactNode>(src);

    React.useEffect(() => {
        setIcon(src);
    }, [src]);

    if (!icon) return null;
    if (typeof icon === "string") {
        return (
            <Image
                src={icon}
                alt={alt}
                className={className}
                width={width}
                height={height}
                style={style}
                onError={(e) => {
                    setIcon(FaQuestion);
                }}
            />
        );
    } else if (React.isValidElement(icon)) {
        return React.cloneElement(icon, props);
    } else {
        return null;
    }
}
