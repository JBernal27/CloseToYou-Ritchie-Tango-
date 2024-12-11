import React, {createContext, ReactNode, useState, useEffect} from 'react';
import {ISettings} from '../interfaces/settings.interface';
import {SettingsService} from '../services/settings.service';
import { BackendAxiosInstance, BackendAxiosInstanceFormData } from '../../axios.config';

interface GlobalContextType {
  settings: ISettings | undefined;
  setSettings: (settings: ISettings) => void;
  snackbarInfo: SnackbarProps;
  setSnackbarInfo: (snackbarInfo: SnackbarProps) => void;
}

interface SnackbarProps {
  actionText?: string;
  onActionPress?: () => void;
  duration?: number;
  message: string;
  position?: 'top' | 'bottom';
  type: 'error' | 'warning' | 'info' | 'success';
  isVisible: boolean;
}

const defaultSettings: ISettings = {
  id: 0,
  isFirstTime: true,
  name: '',
  email: '',
  phoneNumber: '',
  location: {latitude: 0, longitude: 0},
  token: '',
  wantsBackup: false,
  password: '',
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalProvider = ({children}: {children: ReactNode}) => {
  const [settings, setSettings] = useState<ISettings>();
  const [snackbarInfo, setSnackbarInfo] = useState<SnackbarProps>({
    message: '',
    actionText: '',
    onActionPress: () => {},
    duration: 4000,
    position: 'bottom',
    type: 'info',
    isVisible: false,
  });

  useEffect(() => {
    const saveSettings = async () => {
      if (settings) {
        await SettingsService.saveSettings(settings);
        console.log('Settings guardados exitosamente');
        console.log(settings);
        
      }
    };

    saveSettings();
  }, [settings]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const obtainedSettings = await SettingsService.getSettings();
        console.log('Settings obtenidos:', obtainedSettings);
        if (obtainedSettings) {
          setSettings(obtainedSettings as ISettings);
          if (obtainedSettings.token) {
            console.log('Token encontrado, se iniciará sesión');
            BackendAxiosInstance.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${obtainedSettings.token}`;
      
            BackendAxiosInstanceFormData.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${obtainedSettings.token}`;
          }
        } else {
          console.log('No se pudieron obtener los settings');
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.log('Error al obtener los settings', error);
      }
    };

    loadSettings();
    
  }, []);

  return (
    <GlobalContext.Provider value={{settings, setSettings, snackbarInfo, setSnackbarInfo}}>
      {children}
    </GlobalContext.Provider>
  );
};

export {GlobalContext, GlobalProvider};
