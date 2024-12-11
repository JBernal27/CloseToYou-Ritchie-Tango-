import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { UserService } from '../../../services/users.service';
import { GlobalContext } from '../../../utilities/global.context';
import { ContactsService } from '../../../services/contacts.service';

export const useLogin = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(GlobalContext!);

  const showAlert = (): Promise<'download' | 'upload'> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Sincronización de contactos',
        '¿Deseas subir tus contactos actuales o eliminarlos y bajar los de la nube?',
        [
          {
            text: 'Solo bajar',
            onPress: () => resolve('download'),
          },
          {
            text: 'Subir contactos',
            onPress: () => resolve('upload'),
          },
        ],
      );
    });
  };

  const handleContactsAction = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userChoice = await showAlert();

      if (userChoice === 'download') {
        await login(email, password);
      } else if (userChoice === 'upload') {
        console.log('Subiendo contactos...');
        await login(email, password);
        await ContactsService.syncContacts();
      }
    } catch (error) {
      context?.setSnackbarInfo({
        message: 'Hubo un error durante la sincronización de contactos.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoggingIn(true);
    setIsLoading(true);
    try {
      const isLoginSuccessful = await UserService.login(email, password);

      if (isLoginSuccessful) {
        context?.setSnackbarInfo({
          message: 'Inicio de sesión exitoso.',
          type: 'success',
          isVisible: true,
        });
        context?.setSettings(isLoginSuccessful);
      } else {
        context?.setSnackbarInfo({
          message: 'Credenciales incorrectas. Por favor, intenta de nuevo.',
          type: 'error',
          isVisible: true,
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        context?.setSnackbarInfo({
          message: 'Credenciales incorrectas. Por favor, intenta de nuevo.',
          type: 'error',
          isVisible: true,
        });
      } else {
        context?.setSnackbarInfo({
          message: 'Hubo un error al iniciar sesión. Por favor contacta al administrador.',
          type: 'error',
          isVisible: true,
        });
      }
    } finally {
      setIsLoggingIn(false);
      setIsLoading(false);
    }
  };

  const onSubmit = async (email: string, password: string) => {
    try {
      await handleContactsAction(email, password);
      return true;
    } catch {
      context?.setSnackbarInfo({
        message: 'Hubo un error al iniciar sesión. Por favor intenta de nuevo.',
        type: 'error',
        isVisible: true,
      });
      return false;
    }
  };

  return { onSubmit, isLoggingIn, isLoading };
};
