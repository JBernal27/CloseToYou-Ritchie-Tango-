import {useState, useEffect, useMemo} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {IContact} from '../../../interfaces/contact.interface';
import {ContactsService} from '../../../services/contacts.service.ts';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Alert} from 'react-native';

export function useHomeLogic() {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<IContact[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const focused = useIsFocused();

  const requestLocationPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permiso denegado',
          'Necesitas conceder permisos desde la configuracion para acceder a la ubicación.',
        );
      }
    } catch (error) {
      console.warn('Error al solicitar permiso:', error);
    }
  };

  // const requestCameraPermission = async () => {
  //   try {
  //     const result = await request(PERMISSIONS.ANDROID.CAMERA);

  //     if (result !== RESULTS.GRANTED) {
  //       Alert.alert('Permiso denegado', result);
  //     }
  //   } catch (error) {
  //     console.warn('Error al solicitar permiso de cámara:', error);
  //   }
  // };

  const requestGalleryPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

      if (result !== RESULTS.GRANTED) {
        Alert.alert('Permiso denegado', 'No tienes acceso a la galería');
      }
    } catch (error) {
      console.warn('Error al solicitar permiso de galería:', error);
    }
  };

  const requestPermissions = async () => {
    await requestLocationPermission();
    await requestGalleryPermission();
  };

  useEffect(() => {
    requestPermissions();
  });

  const getContacts = async () => {
    try {
      setIsLoading(true);
      const savedContacts = await ContactsService.getContacts();
      if (savedContacts) {
        setContacts(savedContacts);
        setFilteredContacts(savedContacts);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
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
    const groupedByLetter: {[key: string]: IContact[]} = {};

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

    return [{title: 'Favoritos', data: favorites}, ...letterSections];
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
    isLoading,
  };
}
