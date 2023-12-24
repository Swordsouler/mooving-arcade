import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useGames } from "@/providers/GamesProvider";
import { useEffect } from "react";
import { useRouter } from "next/router";

const AddGame = () => {
    const { emulators, setEmulators } = useGames();
    const [emulatorName, setEmulatorName] = useState<string>("");
    const [args, setArgs] = useState<string>("");
    const [emulator, setEmulatorPath] = useState<File | null>(null);
    const [image, setImagePath] = useState<File | null>(null);
    const [gameDirectoryPath, setGameDirectoryPath] = useState<string>("");
    const [launchDirectoryPath, setLaunchDirectoryPath] = useState<string>("");
    const [imageDirectoryPath, setImageDirectoryPath] = useState<string>("");
    const router = useRouter();

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!emulatorName || !emulatorPath || !imagePath) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        if (emulators.find((e) => e.name === emulatorName)) {
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
            },
        ]);
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

    return (
        <>
            {dialogOpen && <div className='overlay'></div>}
            <form onSubmit={handleSubmit} className='add'>
                <div>
                    <label htmlFor='emulator-name'>
                        Nom de l&apos;émulateur
                    </label>
                    <input
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

                <button type='submit'>Ajouter l&apos;émulateur</button>
                <button type='button'>Scanner les jeux</button>
            </form>
        </>
    );
};

export default AddGame;
