import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useGames } from "@/providers/GamesProvider";
import { EmulatorProps } from "@/components/Emulator";

const AddGame = () => {
    const { emulators, games, setGames } = useGames();
    const [gameName, setGameName] = useState<string>("");
    const [emulator, setEmulator] = useState<string>("");
    const [game, setGamePath] = useState<File | null>(null);
    const [image, setImagePath] = useState<File | null>(null);
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
        // Logic to handle form submission
        setGames([
            ...games,
            {
                name: gameName,
                emulator: emulator,
                path: gamePath,
                icon: imagePath,
            },
        ]);
    };

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        setFile: (file: File | null) => void
    ) => {
        console.log(e.target.files);
        setFile(e.target.files ? e.target.files[0] : null);
    };

    return (
        <form onSubmit={handleSubmit} className='add'>
            <div>
                <label htmlFor='game-name'>Nom du jeu</label>
                <input
                    type='text'
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    id='game-name'
                />
            </div>

            <div>
                <label htmlFor='emulator'>Émulateur</label>
                <select
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
                    />
                </label>
            </div>

            <button type='submit'>Ajouter le jeu</button>
        </form>
    );
};

export default AddGame;
