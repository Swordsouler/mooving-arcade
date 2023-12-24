import React from "react";

type GamepadContextType = {};

const GamepadContext = React.createContext({} as GamepadContextType);

function GamepadProvider(props: { children: React.ReactNode }) {
    const { children } = props;

    return (
        <GamepadContext.Provider value={{}}>{children}</GamepadContext.Provider>
    );
}

const useGamepad = (): GamepadContextType => {
    return React.useContext(GamepadContext);
};

export { GamepadContext, GamepadProvider, useGamepad };
