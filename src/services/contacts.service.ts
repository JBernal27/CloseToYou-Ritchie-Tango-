import AsyncStorage from '@react-native-async-storage/async-storage';
import { IContact } from '../interfaces/contact.interface';

const CONTACTS_KEY = 'contacts';

export class ContactsService {
  static async getContacts(): Promise<IContact[]> {
    try {
      const contactsJson = await AsyncStorage.getItem(CONTACTS_KEY);
      return contactsJson ? JSON.parse(contactsJson) : [];
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      return [];
    }
  }

  static async saveContacts(contacts: IContact[]): Promise<void> {
    try {
      const contactsJson = JSON.stringify(contacts);
      await AsyncStorage.setItem(CONTACTS_KEY, contactsJson);
    } catch (error) {
      console.error('Error al guardar contactos:', error);
    }
  }

  static async addContact(newContact: IContact): Promise<void> {
    try {
      const contacts = await this.getContacts();
      contacts.push(newContact);
      await this.saveContacts(contacts);
    } catch (error) {
      console.error('Error al agregar contacto:', error);
    }
  }

  static async updateContact(id: number, updatedContact: Partial<IContact>): Promise<void> {
    try {
      const contacts = await this.getContacts();
      const contactIndex = contacts.findIndex((contact) => contact.id === id);

      if (contactIndex !== -1) {
        contacts[contactIndex] = { ...contacts[contactIndex], ...updatedContact };
        await this.saveContacts(contacts);
      }
    } catch (error) {
      console.error('Error al actualizar contacto:', error);
    }
  }

  static async deleteContact(id: number): Promise<void> {
    try {
      const contacts = await this.getContacts();
      const filteredContacts = contacts.filter((contact) => contact.id !== id);
      await this.saveContacts(filteredContacts);
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
    }
  }
}
