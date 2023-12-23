import React from "react";

type RotatorContextType = {
    angle: number;
    setAngle: (angle: number) => void;
    rotate: () => void;
};

const RotatorContext = React.createContext({} as RotatorContextType);

function RotatorProvider(props: { children: React.ReactNode }) {
    const { children } = props;
    const [angle, _setAngle] = React.useState<number>(
        Number(window.localStorage.getItem("angle")) || 0
    );

    React.useEffect(() => {
        const storedAngle =
            typeof window !== "undefined"
                ? Number(window.localStorage.getItem("angle")) || 0
                : 0;
        _setAngle(storedAngle);
    }, []);

    const setAngle = (angle: number) => {
        localStorage.setItem("angle", (angle % 360).toString());
        _setAngle(angle);
    };

    const rotate = () => {
        setAngle(angle + 90);
    };
    const rotation = React.useMemo(() => angle % 180 !== 0, [angle]);

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
                        display: "flex",
                        flexDirection: "column",
                        width: rotation ? "100vh" : "100vw",
                        height: rotation ? "100vw" : "100vh",
                        transition: "all 0.5s",
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
