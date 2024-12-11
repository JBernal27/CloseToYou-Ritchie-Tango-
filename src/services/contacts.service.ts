import AsyncStorage from '@react-native-async-storage/async-storage';
import { IContact } from '../interfaces/contact.interface';
import {
  BackendAxiosInstance,
  BackendAxiosInstanceFormData,
} from '../../axios.config';
import { SettingsService } from './settings.service';

const CONTACTS_KEY = 'contacts';

export class ContactsService {
  private static async isAuthenticated(): Promise<boolean> {
    const settings = await SettingsService.getSettings();
    return Boolean(settings?.wantsBackup);
  }

  static async getContacts(): Promise<IContact[]> {
    const isAuthenticated = await this.isAuthenticated();
    const settings = await SettingsService.getSettings();
    if (isAuthenticated) {
      try {
        const response = await BackendAxiosInstance.get(
          `/${CONTACTS_KEY}/user/${settings?.id}`,
        );
        const contacts = response.data;
        await this.saveContacts(contacts);
        return contacts;
      } catch (error) {
        console.error('Error al obtener contactos del backend:', error);
        return await this.getContactsFromStorage();
      }
    } else {
      return await this.getContactsFromStorage();
    }
  }

  private static async getContactsFromStorage(): Promise<IContact[]> {
    try {
      const contactsJson = await AsyncStorage.getItem(CONTACTS_KEY);
      return contactsJson ? JSON.parse(contactsJson) : [];
    } catch (error) {
      console.error('Error al obtener contactos de AsyncStorage:', error);
      return [];
    }
  }

  private static async saveContacts(contacts: IContact[]): Promise<void> {
    try {
      const contactsJson = JSON.stringify(contacts);
      await AsyncStorage.setItem(CONTACTS_KEY, contactsJson);
    } catch (error) {
      console.error('Error al guardar contactos en AsyncStorage:', error);
    }
  }

  static async addContact(newContactFormData: FormData, newContactObject: IContact): Promise<void> {
    const isAuthenticated = await this.isAuthenticated();
    const contacts = await this.getContactsFromStorage();

    if (isAuthenticated) {
      try {
        const response = await BackendAxiosInstanceFormData.post(
          `/${CONTACTS_KEY}`,
          newContactFormData,
        );
        contacts.push(response.data as IContact);
        await this.saveContacts(contacts);
      } catch (error) {
        console.error('Error al agregar contacto en el backend:', error);
      }
    } else {
      contacts.push(newContactObject as IContact);
      await this.saveContacts(contacts);
    }
  }

  static async updateContact(
    id: number,
    updatedContact: FormData,
    updatedContactObject: IContact,
  ): Promise<void> {
    const isAuthenticated = await this.isAuthenticated();
    const contacts = await this.getContactsFromStorage();
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    console.log(updatedContactObject);
    console.log(updatedContact);
    if (contactIndex !== -1) {
      if (isAuthenticated) {
        try {
          await BackendAxiosInstanceFormData.put(
            `/${CONTACTS_KEY}/${id}`,
            updatedContact,
          );
          contacts[contactIndex] = {
            ...contacts[contactIndex],
            ...updatedContactObject,
          };
          await this.saveContacts(contacts);
        } catch (error) {
          console.error('Error al actualizar contacto en el backend:', error);
        }
      } else {
        contacts[contactIndex] = {
          ...contacts[contactIndex],
          ...updatedContactObject,
        };
        await this.saveContacts(contacts);
      }
    }
  }

  static async deleteContact(id: number): Promise<void> {
    const isAuthenticated = await this.isAuthenticated();
    const contacts = await this.getContactsFromStorage();
    const filteredContacts = contacts.filter(contact => contact.id !== id);

    if (isAuthenticated) {
      try {
        await BackendAxiosInstance.delete(`/${CONTACTS_KEY}/${id}`);
      } catch (error) {
        console.error('Error al eliminar contacto en el backend:', error);
      }
    }
    await this.saveContacts(filteredContacts);
  }

  static async cleanContacts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONTACTS_KEY);
    } catch (error) {
      console.error('Error al limpiar contactos en AsyncStorage:', error);
    }
  }

  static async syncContacts(): Promise<void> {
    const isAuthenticated = await this.isAuthenticated();
    const contacts = await this.getContactsFromStorage();

    if (isAuthenticated && contacts.length > 0) {
      for (const contact of contacts) {
        try {
          const contactFormData = new FormData();
          for (const [key, value] of Object.entries(contact)) {
            if (key === 'location' && value) {
              contactFormData.append('latitude', value.latitude.toString());
              contactFormData.append('longitude', value.longitude.toString());
            } else {
              contactFormData.append(key, value as string);
            }
          }

          await BackendAxiosInstanceFormData.post(`/${CONTACTS_KEY}`, contactFormData);
        } catch (error) {
          console.error('Error al sincronizar contacto:', error);
        }
      }
    }
  }
}
