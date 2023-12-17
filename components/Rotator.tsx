import React from "react";

type RotatorContextType = {
    angle: number;
    setAngle: (angle: number) => void;
    rotate: () => void;
};

const RotatorContext = React.createContext({} as RotatorContextType);

function RotatorProvider(props: { children: React.ReactNode }) {
    const { children } = props;
    const [angle, _setAngle] = React.useState<number>(0);

    const setAngle = (angle: number) => {
        angle %= 360;
        localStorage.setItem("angle", angle.toString());
        _setAngle(angle);
    };

    const rotate = () => {
        setAngle(angle + 90);
    };
    const rotation = angle % 180 !== 0;

    return (
        <RotatorContext.Provider
            value={{
                angle,
                setAngle,
                rotate,
            }}>
            <div
                style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <div
                    style={{
                        position: "absolute",
                        transform: `rotate(${angle}deg)`,
                        display: "inline-block",
                        width: rotation ? "100vh" : "100vw",
                        height: rotation ? "100vw" : "100vh",
                    }}>
                    {children}
                </div>
            </div>
        </RotatorContext.Provider>
    );
}

const useRotator = (): RotatorContextType => {
    return React.useContext(RotatorContext);
};

export { RotatorContext, RotatorProvider, useRotator };
