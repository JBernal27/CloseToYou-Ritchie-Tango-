import {
  BackendAxiosInstance,
  BackendAxiosInstanceFormData,
} from '../../axios.config';
import {ISettings} from '../interfaces/settings.interface';
import {IUser} from '../interfaces/user.interface';
import {SettingsService} from './settings.service';
import {jwtDecode} from 'jwt-decode';

export class UserService {
  private static async getUserId(): Promise<number | null> {
    const settings = await SettingsService.getSettings();
    return settings?.id || null;
  }

  static async clearSession(): Promise<void> {
    try {
      const defaultSettings: ISettings = {
        id: 0,
        name: '',
        email: '',
        phoneNumber: '',
        isFirstTime: false,
        location: {
          latitude: 6.218972,
          longitude: -75.583639,
        },
        token: '',
        wantsBackup: false,
        password: '',
      };

      await SettingsService.resetSettings(defaultSettings);

      delete BackendAxiosInstance.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error al eliminar la sesión:', error);
      throw error;
    }
  }

  static async getUser(): Promise<ISettings> {
    try {
      const id = await this.getUserId();
      if (!id) {
        throw new Error('ID de usuario no encontrado en la configuración.');
      }
      const response = await BackendAxiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario del backend:', error);
      throw error;
    }
  }

  static async register(newUser: IUser): Promise<ISettings> {
    try {
      const response = await BackendAxiosInstance.post('/users', newUser);
      console.log(response);
  
      const { email, password } = newUser;
  
      const loggedInSettings = await this.login(email, password);
  
      return loggedInSettings!;
    } catch (error) {
      console.error('Error al registrar usuario en el backend:', error);
      throw error;
    }
  }
  

  static async login(
    email: string,
    password: string,
  ): Promise<ISettings | undefined> {
    try {
      const response = await BackendAxiosInstance.post('/auth/login', {
        email,
        password,
      });

      const {token} = response.data;
      const decodedToken: ISettings = jwtDecode(token);

      const {id, name, email: userEmail, phoneNumber, location} = decodedToken;

      const newSettings = await SettingsService.saveSession(id, token, {
        name,
        email: userEmail,
        phoneNumber,
        location,
      });

      BackendAxiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      BackendAxiosInstanceFormData.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      await SettingsService.updateSetting('token', token);

      return newSettings;
    } catch (error) {
      console.error('Error al iniciar sesión en el backend:', error);
      throw error;
    }
  }

  static async updateUser(
    updatedUserData: Partial<ISettings>,
  ): Promise<ISettings> {
    try {
      const id = await this.getUserId();
      if (!id)
        {throw new Error('ID de usuario no encontrado en la configuración.')};
      const response = await BackendAxiosInstance.put(
        `/users/${id}`,
        updatedUserData,
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario en el backend:', error);
      throw error;
    }
  }

  static async deleteUser(): Promise<void> {
    try {
      const id = await this.getUserId();
      if (!id)
        {throw new Error('ID de usuario no encontrado en la configuración.')};
      await BackendAxiosInstance.delete(`/users/${id}`);
      await this.clearSession();
    } catch (error) {
      console.error('Error al eliminar usuario en el backend:', error);
      throw error;
    }
  }
}
