import { useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { UserService } from '../../../services/users.service';
import { GlobalContext } from '../../../utilities/global.context';
import { ContactsService } from '../../../services/contacts.service';
import { ISettings } from '../../../interfaces/settings.interface';

const DefaultSettings: ISettings = {
  id: 0,
  isFirstTime: false,
  name: '',
  email: '',
  phoneNumber: '',
  location: {
    latitude: 6.218972,
    longitude: -75.583639,
  },
  token: '',
  wantsBackup: false,
  password: '',
};

export const useSettings = () => {
  const [userSettings, setUserSettings] = useState<ISettings>(DefaultSettings);
  const [editable, setEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(GlobalContext!);

  const handleEditToggle = () => setEditable(!editable);

  const handleInputChange = (field: keyof ISettings, value: string) => {
    setUserSettings({ ...userSettings, [field]: value });
  };

  const handleSaveUser = async () => {
    setIsLoading(true);
    try {
      const updatedSettings = await UserService.updateUser(userSettings);
      context?.setSettings(updatedSettings);
      context?.setSnackbarInfo({
        message: 'Datos de usuario actualizados correctamente.',
        type: 'success',
        isVisible: true,
      });
      setEditable(false);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      context?.setSnackbarInfo({
        message: 'Error al actualizar usuario. Intenta nuevamente.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const result = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Mantener Contactos',
        '¿Quieres mantener tus contactos guardados?, luego de cerrar sesión no se realizará copia de seguridad.',
        [
          {
            text: 'Eliminar Contactos',
            style: 'cancel',
            onPress: () => {
              ContactsService.cleanContacts();
              resolve(false);
            },
          },
          {
            text: 'Mantener Contactos',
            onPress: () => {
              resolve(true);
            },
          },
        ]
      );
    });

    if (result) {
      context?.setSnackbarInfo({
        message: 'Los contactos serán mantenidos.',
        type: 'info',
        isVisible: true,
      });
    } else {
      context?.setSnackbarInfo({
        message: 'Se eliminarán los contactos.',
        type: 'info',
        isVisible: true,
      });
    }

    await UserService.clearSession();
    context?.setSettings(DefaultSettings);
    context?.setSnackbarInfo({
      message: 'Has cerrado sesión correctamente.',
      type: 'success',
      isVisible: true,
    });
    setIsLoading(false);
  };

  const handleOnPressLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aceptar', onPress: handleLogout },
    ]);
  };

  useEffect(() => {
    if (context?.settings) {
      setUserSettings(context.settings);
    }
  }, [context?.settings]);

  return {
    userSettings,
    editable,
    isLoading,
    handleEditToggle,
    handleInputChange,
    handleSaveUser,
    handleOnPressLogout,
  };
};
