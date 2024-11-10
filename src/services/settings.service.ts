import AsyncStorage from '@react-native-async-storage/async-storage';
import { ISettings } from '../interfaces/settings.interface';

const SETTINGS_KEY = 'settings';

export class SettingsService {
  static async getSettings(): Promise<ISettings | null> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      return settingsJson ? JSON.parse(settingsJson) : null;
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      return null;
    }
  }

  static async saveSettings(settings: ISettings): Promise<void> {
    try {
      const settingsJson = JSON.stringify(settings);
      await AsyncStorage.setItem(SETTINGS_KEY, settingsJson);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  }

  static async updateSetting<K extends keyof ISettings>(key: K, value: ISettings[K]): Promise<void> {
    try {
      const settings = await this.getSettings() || {} as ISettings;
      settings[key] = value;
      await this.saveSettings(settings);
    } catch (error) {
      console.error(`Error al actualizar configuración (${key}):`, error);
    }
  }

  static async resetSettings(defaultSettings: ISettings): Promise<void> {
    try {
      await this.saveSettings(defaultSettings);
    } catch (error) {
      console.error('Error al restablecer configuración:', error);
    }
  }
}
