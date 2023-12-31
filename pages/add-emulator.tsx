import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useGames } from "@/providers/GamesProvider";
import { useRouter } from "next/router";
import { GameProps } from "@/components/Game";

const AddGame = () => {
    //get params
    const router = useRouter();
    console.log(router.query);

    const { emulators, setEmulators, setGames, allGames } = useGames();
    const [emulatorName, setEmulatorName] = useState<string>(
        (router.query.name as string) ?? ""
    );
    const [args, setArgs] = useState<string>(
        (router.query.args as string) ?? ""
    );
    const [extension, setExtension] = useState<string>(
        (router.query.extension as string) ?? "."
    );
    const [emulator, setEmulatorPath] = useState<File | null>(
        // @ts-ignore
        router.query.path ? { path: router.query.path as string } : null
    );
    const [image, setImagePath] = useState<File | null>(
        // @ts-ignore
        router.query.icon ? { path: router.query.icon as string } : null
    );
    const [gameDirectoryPath, setGameDirectoryPath] = useState<string>(
        (router.query.gameDirectoryPath as string) ?? ""
    );
    const [launchDirectoryPath, setLaunchDirectoryPath] = useState<string>(
        (router.query.launchDirectoryPath as string) ?? ""
    );
    const [imageDirectoryPath, setImageDirectoryPath] = useState<string>(
        (router.query.imageDirectoryPath as string) ?? ""
    );

    const emulatorPath = useMemo(() => {
        if (emulator) {
            // @ts-ignore
            return emulator.path;
        }
    }, [emulator]);

    const imagePath = useMemo(() => {
        if (image) {
            // @ts-ignore
            return image.path;
        }
    }, [image]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!emulatorName || !emulatorPath || !imagePath) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        if (router.query.edit === "true") {
            const newEmulators = emulators.map((e) => {
                if (e.name === router.query.name) {
                    return {
                        name: emulatorName,
                        path: emulatorPath,
                        args: args,
                        icon: imagePath,
                        gameDirectoryPath: gameDirectoryPath,
                        launchDirectoryPath: launchDirectoryPath,
                        imageDirectoryPath: imageDirectoryPath,
                        extension: extension,
                    };
                }
                return e;
            });
            setEmulators(newEmulators);
        } else {
            if (
                emulators.find((e) => e.name === emulatorName) ||
                emulatorName === "Favoris"
            ) {
                alert("Un émulateur avec ce nom existe déjà");
                return;
            }
            setEmulators([
                ...emulators,
                {
                    name: emulatorName,
                    path: emulatorPath,
                    args: args,
                    icon: imagePath,
                    gameDirectoryPath: gameDirectoryPath,
                    launchDirectoryPath: launchDirectoryPath,
                    imageDirectoryPath: imageDirectoryPath,
                    extension: extension,
                },
            ]);
        }
        router.push("/");
    };

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        setFile: (file: File | null) => void
    ) => {
        setFile(e.target.files ? e.target.files[0] : null);
    };

    const [dialogOpen, setDialogOpen] = useState(false);

    function selectDirectory(
        setDirectoryPath: React.Dispatch<React.SetStateAction<string>>
    ) {
        if (!window.electron) return;
        setDialogOpen(true);
        window.electron.send("open-directory-dialog");
        window.electron.on("selected-directory", (event: any) => {
            console.log(event);
            if (event) {
                // Check if event is not empty
                setDirectoryPath(event);
            }
        });
        window.electron.on("dialog-closed", () => {
            console.log("dialog closed");
            setDialogOpen(false);
            window.electron.removeAllListeners("selected-directory");
            window.electron.removeAllListeners("dialog-closed");
        });
    }

    const scanGames = () => {
        // scanner les jeux qui ont l'extension "extension" dans le dossier "gameDirectoryPath"
        // et effacer tout les qui ont le nom de l'émulateur
        // et ajouter les jeux dans la liste des jeux
        if (!window.electron) return;

        window.electron
            .invoke("scan-games", {
                emulatorName,
                gameDirectoryPath,
                imageDirectoryPath,
                extension,
            })
            .then((games: GameProps[]) => {
                console.log(games);
                // if the game name is the same and emulator is the same, just don't add it
                const newGames = games.filter(
                    (game) =>
                        !allGames.find(
                            (g) =>
                                g.name === game.name &&
                                g.emulator === game.emulator
                        )
                );
                setGames([...allGames, ...newGames]);
                //submit the form
                handleSubmit(new Event("submit"));
            })
            .catch((err: any) => {
                console.log(err);
                alert("Erreur lors du scan des jeux: " + err);
            });
    };

    const deleteEmulator = () => {
        // ask for confirmation
        if (!confirm("Voulez-vous vraiment supprimer cet émulateur ?")) return;

        const newEmulators = emulators.filter(
            (emulator) => emulator.name !== router.query.name
        );
        setEmulators(newEmulators);

        const newGames = allGames.filter(
            (game) => game.emulator !== router.query.name
        );
        setGames(newGames);
        router.push("/");
    };

    return (
        <>
            {dialogOpen && <div className='overlay'></div>}
            <form onSubmit={handleSubmit} className='add' id='form'>
                <div>
                    <label htmlFor='emulator-name'>
                        Nom de l&apos;émulateur
                    </label>
                    <input
                        disabled={router.query.edit === "true"}
                        type='text'
                        value={emulatorName}
                        onChange={(e) => setEmulatorName(e.target.value)}
                        id='emulator-name'
                    />
                </div>

                <div>
                    <label htmlFor='emulator-path'>
                        Chemin vers l&apos;émulateur
                    </label>
                    <label className='input'>
                        {emulatorPath}
                        <input
                            type='file'
                            onChange={(e) =>
                                handleFileChange(e, setEmulatorPath)
                            }
                            id='emulator-path'
                            accept='.exe'
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor='emulator-args'>
                        Arguments de lancement
                    </label>
                    <input
                        type='text'
                        value={args}
                        onChange={(e) => setArgs(e.target.value)}
                        id='emulator-args'
                    />
                </div>

                <div>
                    <label htmlFor='image-path'>Chemin vers l&apos;image</label>
                    <label className='input'>
                        {imagePath}
                        <input
                            type='file'
                            onChange={(e) => handleFileChange(e, setImagePath)}
                            id='image-path'
                            accept='image/*'
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor='game-path'>
                        Chemin du dossier de lancement
                    </label>
                    <label className='input'>
                        {launchDirectoryPath}
                        <input
                            style={{ width: "100%", visibility: "hidden" }}
                            type='button'
                            id='game-path'
                            onClick={() =>
                                selectDirectory(setLaunchDirectoryPath)
                            }
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor='game-path'>
                        Chemin du dossier vers les jeux
                    </label>
                    <label className='input'>
                        {gameDirectoryPath}
                        <input
                            style={{ width: "100%", visibility: "hidden" }}
                            type='button'
                            id='game-path'
                            onClick={() =>
                                selectDirectory(setGameDirectoryPath)
                            }
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor='game-path'>
                        Chemin du dossier vers les images
                    </label>
                    <label className='input'>
                        {imageDirectoryPath}
                        <input
                            style={{ width: "100%", visibility: "hidden" }}
                            type='button'
                            id='game-path'
                            onClick={() =>
                                selectDirectory(setImageDirectoryPath)
                            }
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor='extension'>
                        Extension des fichiers de jeux
                    </label>
                    <input
                        type='text'
                        value={extension}
                        onChange={(e) => {
                            // the first character is always a dot
                            if (e.target.value[0] !== ".") {
                                setExtension("." + e.target.value);
                            } else {
                                setExtension(e.target.value);
                            }
                        }}
                        id='extension'
                    />
                </div>

                <button type='submit'>
                    {router.query.edit ? "Modifier" : "Ajouter"}{" "}
                    l&apos;émulateur
                </button>
                {router.query.edit && (
                    <button type='button' onClick={deleteEmulator}>
                        Supprimer l&apos;émulateur
                    </button>
                )}
                <button type='button' onClick={scanGames}>
                    Scanner les jeux
                </button>
            </form>
        </>
    );
};

export default AddGame;
