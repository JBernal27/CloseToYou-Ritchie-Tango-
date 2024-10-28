import { useState, useEffect, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { IContact } from '../../../interfaces/contact.interface';
import { ContactsService } from '../../../services/contacts.service.ts';

export function useHomeLogic() {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<IContact[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const focused = useIsFocused();

  const getContacts = async () => {
    try {
      const savedContacts = await ContactsService.getContacts();
      if (savedContacts) {
        setContacts(savedContacts);
        setFilteredContacts(savedContacts);
      }
    } catch (error) {
      console.error('Error al cargar los contactos:', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = contacts.filter(
      contact =>
        contact.name.toLocaleLowerCase().startsWith(text.toLocaleLowerCase()) ||
        contact.number.toString().startsWith(text) ||
        (contact.email && contact.email.toLowerCase().startsWith(text)),
    );
    setFilteredContacts(filtered);
  };

  const sections = useMemo(() => {
    const favorites = filteredContacts.filter(contact => contact.isFavorite);
    const groupedByLetter: { [key: string]: IContact[] } = {};

    filteredContacts.forEach(contact => {
      const firstLetter = contact.name[0].toUpperCase();
      if (!groupedByLetter[firstLetter]) {
        groupedByLetter[firstLetter] = [];
      }
      groupedByLetter[firstLetter].push(contact);
    });

    const letterSections = Object.keys(groupedByLetter)
      .sort()
      .map(letter => ({
        title: letter,
        data: groupedByLetter[letter],
      }));

    return [
      { title: 'Favoritos', data: favorites },
      ...letterSections,
    ];
  }, [filteredContacts]);

  useEffect(() => {
    if (focused) {
      getContacts();
    }
  }, [focused]);

  return {
    sections,
    searchText,
    handleSearch,
  };
}
