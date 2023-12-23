import Image from "next/image";
import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import { FaQuestion } from "react-icons/fa6";
import path from "path";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icon } from "./Icon";
import { ClickContainer } from "./ClickContainer";

export type GameProps = {
    name: string;
    path?: string;
    icon?: string | React.ReactNode;
    emulator?: string;
    onClick?: (() => void) | string;
    style?: React.CSSProperties;
};

export function Game(props: GameProps) {
    const {
        name,
        icon = FaQuestion,
        emulator = "",
        onClick = () => {},
        style,
    } = props;
    const { itemsHeight } = useSettings();

    return (
        <ClickContainer
            action={onClick}
            style={{
                width: "100%",
                height: itemsHeight + "px",
            }}>
            <div
                className='game'
                style={{
                    transition: "all 0.2s",
                    height: itemsHeight + "px",
                    ...style,
                    overflow: "hidden",
                }}>
                <div className='icon'>
                    <Icon
                        src={icon}
                        alt={name}
                        className='game-icon'
                        width={100}
                        height={100}
                        style={{
                            borderBottomRightRadius: itemsHeight / 16 + "px",
                            outline: "1px solid var(--color-primary)",
                        }}
                    />
                    {emulator !== "" && (
                        <Image
                            src={
                                "https://i.pinimg.com/originals/7c/b4/dd/7cb4dd707f844c353f881696ebe0ada8.png"
                            }
                            alt={name}
                            className='emulator-icon'
                            width={100}
                            height={100}
                            style={{
                                width: itemsHeight / 4 + "px",
                                height: itemsHeight / 4 + "px",
                                borderRadius: itemsHeight / 16 + "px",
                                borderBottomRightRadius:
                                    itemsHeight / 16 + "px",
                                marginTop:
                                    itemsHeight - itemsHeight / 4 - 1 + "px",
                                marginLeft: -itemsHeight / 4 - 1 + "px",
                                border: "1px solid var(--color-primary)",
                            }}
                        />
                    )}
                </div>
                <div
                    className='name'
                    style={{
                        fontSize: itemsHeight / 4 + "px",
                        paddingLeft: itemsHeight / 8 + "px",
                        paddingRight: itemsHeight / 8 + "px",
                    }}>
                    <p
                        className='game-name'
                        style={{
                            fontSize: itemsHeight / 3 + "px",
                        }}>
                        {name}
                    </p>
                    <p className='emulator-name'>{emulator}</p>
                </div>
            </div>
        </ClickContainer>
    );
}

const Container = (props: {
    children: React.ReactNode;
    action: (() => void) | string;
}) => {
    const { children, action } = props;
    const { itemsHeight } = useSettings();
    if (typeof action === "string") {
        return (
            <Link
                href={action}
                style={{
                    textDecoration: "none",
                    width: "100%",
                    height: itemsHeight + "px",
                }}>
                {children}
            </Link>
        );
    } else {
        return (
            <div
                onClick={action}
                style={{
                    width: "100%",
                    height: itemsHeight + "px",
                }}>
                {children}
            </div>
        );
    }
};
