import { useSettings } from "@/providers/SettingsProvider";
import React from "react";
import "@/styles/settings.css";

const Settings = () => {
    const {
        headerHeight,
        setHeaderHeight,
        primaryColor,
        setPrimaryColor,
        secondaryColorIntensity,
        setSecondaryColorIntensity,
        folderBarPlacement,
        setFolderBarPlacement,
    } = useSettings();

    return (
        <main className='settings'>
            <div>
                <label htmlFor='header-height'>Hauteur des en têtes</label>
                <div className='input'>
                    <input
                        type='range'
                        min='50'
                        max='200'
                        value={headerHeight}
                        onChange={(e) =>
                            setHeaderHeight(Number(e.target.value))
                        }
                        className='slider'
                        id='header-height'
                    />
                    <span>{headerHeight}px</span>
                </div>
            </div>

            <div>
                <label htmlFor='primary-color'>Couleur primaire</label>
                <input
                    type='color'
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    id='primary-color'
                />
            </div>

            <div>
                <label htmlFor='secondary-color'>
                    Intensité de la couleur secondaire
                </label>
                <div className='input'>
                    <input
                        type='range'
                        min='25'
                        max='100'
                        value={secondaryColorIntensity}
                        onChange={(e) =>
                            setSecondaryColorIntensity(Number(e.target.value))
                        }
                        className='slider'
                        id='header-height'
                    />
                    <span>{secondaryColorIntensity}%</span>
                </div>
            </div>

            <div>
                <label htmlFor='folder-bar-placement'>
                    Placement de la barre de dossiers
                </label>
                <select
                    value={folderBarPlacement}
                    onChange={(e) =>
                        setFolderBarPlacement(e.target.value as any)
                    }
                    id='folder-bar-placement'>
                    <option value='top'>en haut</option>
                    <option value='bottom'>en bas</option>
                    <option value='left'>à gauche</option>
                    <option value='right'>à droite</option>
                </select>
            </div>
        </main>
    );
};

export default Settings;
