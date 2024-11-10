import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { ISettings } from '../interfaces/settings.interface';
import { SettingsService } from '../services/settings.service';

interface GlobalContextType {
    settings: ISettings;
    setSettings: (settings: ISettings) => void;
}

const defaultSettings: ISettings = {
    isFirstTime: false,
    name: '',
    email: '',
    phone: '',
    location: '',
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<ISettings>(defaultSettings);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const obtainedSettings = await SettingsService.getSettings();
                console.log('Settings obtenidos:', obtainedSettings);
                if (obtainedSettings) {
                    setSettings(obtainedSettings as ISettings);
                } else {
                    console.log('No se pudieron obtener los settings');
                }
            } catch (error) {
                console.log('Error al obtener los settings', error);
            }
        };

        loadSettings();
    }, []);

    useEffect(() => {
        const saveSettings = async () => {
            if (settings) {
                await SettingsService.saveSettings(settings);
                console.log('Settings guardados exitosamente');
            }
        };

        saveSettings();
    }, [settings]);

    return (
        <GlobalContext.Provider value={{ settings, setSettings }}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContext, GlobalProvider };
