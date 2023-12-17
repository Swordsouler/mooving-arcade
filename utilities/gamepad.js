import { get } from "http";
import { execute } from "./command";

export function closeGame() {
    execute("taskkill /IM Dolphin.exe /F");
}

export function openGame() {
    execute(
        `J:\\Emulateur\\Dolphin\\Dolphin.exe -b -e "J:\\Emulateur\\Jeux\\Dolphin\\Pikmin\\Pikmin (Europe) (En,Fr,De,Es,It).nkit.iso"`
    );
}

// prettier-ignore
export function getConfig() {
    return {
        controller: {
            delay: 1000,
            buttons: {
                '0': closeGame,
                '1': openGame,
                '2': () => {},
                '3': () => {},
                '4': () => {},
                '5': () => {},
                '6': () => {},
                '7': () => {},
                '8': () => {},
                '9': () => {},
                '10': () => {},
                '11': () => {},
                '12': () => {},
                '13': () => {},
                '14': () => {},
                '15': () => {},
                '16': () => {},
            },
        },
    };
}

export const Controller = {
    controllers: {},
    config: getConfig(),
    init: () => {
        Controller.controllers = {};
        console.log("init controller");

        window.addEventListener("gamepadconnected", ({ gamepad }) => {
            Controller.controllers[gamepad.index] = Object.keys(
                getConfig().controller.buttons
            ).map((key) => {
                return {
                    action: getConfig().controller.buttons[key],
                    pressed: false,
                    timeout: null,
                };
            });
        });

        window.addEventListener("gamepaddisconnected", ({ gamepad }) => {
            delete Controller.controllers[gamepad.index];
        });

        function scanGamepads() {
            var gamepads = navigator.getGamepads();

            Array.from(gamepads).forEach((gamepad) => {
                if (gamepad) {
                    gamepad.buttons.forEach((button, idx) => {
                        if (button.pressed) {
                            if (
                                !Controller.controllers[gamepad.index][idx]
                                    .pressed
                            ) {
                                Controller.controllers[gamepad.index][
                                    idx
                                ].pressed = button.pressed;
                                Controller.controllers[gamepad.index][
                                    idx
                                ].timeout = setTimeout(() => {
                                    controllers[gamepad.index][
                                        idx
                                    ].pressed = false;
                                }, getConfig().controller.delay);

                                Controller.controllers[gamepad.index][
                                    idx
                                ].action(button, idx);
                            }
                        } else {
                            if (
                                Controller.controllers[gamepad.index][idx]
                                    .pressed
                            ) {
                                Controller.controllers[gamepad.index][
                                    idx
                                ].pressed = button.pressed;
                                clearTimeout(
                                    Controller.controllers[gamepad.index][idx]
                                        .timeout
                                );
                            }
                        }
                    });
                }
            });

            window.requestAnimationFrame(scanGamepads);
        }

        scanGamepads();
    },
};
