import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useGames } from "@/providers/GamesProvider";
import { EmulatorProps } from "@/components/Emulator";
import { useRouter } from "next/router";

const AddGame = () => {
    const router = useRouter();

    const { emulators, setGames, allGames } = useGames();
    const [gameName, setGameName] = useState<string>(
        (router.query.name as string) ?? ""
    );
    const [emulator, setEmulator] = useState<string>(
        (router.query.emulator as string) ??
            (emulators !== undefined && emulators.length > 0
                ? emulators[0].name
                : "")
    );
    const [game, setGamePath] = useState<File | null>(
        // @ts-ignore
        router.query.path ? { path: router.query.path as string } : null
    );
    const [image, setImagePath] = useState<File | null>(
        // @ts-ignore
        router.query.icon ? { path: router.query.icon as string } : null
    );

    const gamePath = useMemo(() => {
        if (game) {
            // @ts-ignore
            return game.path;
        }
    }, [game]);

    const imagePath = useMemo(() => {
        if (image) {
            // @ts-ignore
            return image.path;
        }
    }, [image]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!gameName || !emulator || !gamePath || !imagePath) {
            alert("Veuillez remplir tous les champs");
            return;
        }
        if (router.query.edit === "true") {
            console.log("edit");
            //just modify the game that have the same name and emulator
            const newGames = allGames.map((game) => {
                console.log(game, gameName, emulator);
                if (game.name === gameName && game.emulator === emulator) {
                    return {
                        name: gameName,
                        emulator: emulator,
                        path: gamePath,
                        icon: imagePath,
                    };
                }
                return game;
            });
            console.log(newGames);
            setGames(newGames);
        } else {
            // Logic to handle form submission
            setGames([
                ...allGames,
                {
                    name: gameName,
                    emulator: emulator,
                    path: gamePath,
                    icon: imagePath,
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

    const deleteGame = () => {
        // remove game that have the same name and emulator
        // ask for confirmation
        if (!confirm("Voulez-vous vraiment supprimer ce jeu ?")) return;

        const newGames = allGames.filter(
            (game) => !(game.name === gameName && game.emulator === emulator)
        );
        setGames(newGames);
        router.push("/");
    };

    const acceptExtension = React.useMemo(() => {
        const extensions = emulators
            .filter((emu) => emu.name === emulator)
            .map((emu) => emu.extension);
        return extensions.length > 0 ? extensions.join(",") : undefined;
    }, [emulator, emulators]);

    return (
        <form onSubmit={handleSubmit} className='add'>
            <div>
                <label htmlFor='game-name'>Nom du jeu</label>
                <input
                    disabled={router.query.edit === "true"}
                    type='text'
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    id='game-name'
                />
            </div>

            <div>
                <label htmlFor='emulator'>Émulateur</label>
                <select
                    disabled={router.query.edit === "true"}
                    value={emulator}
                    onChange={(e) => setEmulator(e.target.value)}
                    id='emulator'>
                    {emulators.map((emulator: EmulatorProps) => (
                        <option key={emulator.name} value={emulator.name}>
                            {emulator.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor='game-path'>Chemin du jeu</label>
                <label className='input'>
                    {gamePath}
                    <input
                        type='file'
                        onChange={(e) => handleFileChange(e, setGamePath)}
                        id='game-path'
                        accept={acceptExtension}
                    />
                </label>
            </div>

            <div>
                <label htmlFor='image-path'>Chemin de l&apos;image</label>
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

            <button type='submit'>
                {router.query.edit ? "Modifier" : "Ajouter"} le jeu
            </button>
            {router.query.edit && (
                <button type='button' onClick={deleteGame}>
                    Supprimer le jeu
                </button>
            )}
        </form>
    );
};

export default AddGame;
