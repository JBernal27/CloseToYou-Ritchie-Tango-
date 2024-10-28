import { useState } from 'react';
import { Alert } from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { IContact } from '../../../interfaces/contact.interface';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../router/navigations';
import { Roles } from '../../../enum/roles.enum';
import { ContactsService } from '../../../services/contacts.service.ts';
import { Region } from 'react-native-maps';

export const useAddContact = (
  contact: Partial<IContact> = {
    isFavorite: false,
    image: '',
    role: Roles.EMPLEADO,
  },
) => {
  const [name, setName] = useState(contact.name || '');
  const [role, setRole] = useState(contact.role || Roles.EMPLEADO);
  const [email, setEmail] = useState(contact.email || '');
  const [number, setNumber] = useState(contact.number?.toString() || '');
  const [isFavorite, setIsFavorite] = useState(contact.isFavorite);
  const [imageUri, setImageUri] = useState<string | undefined>(contact.image);
  const [location, setLocation] = useState<Region>(
    contact.location || {
      latitude: 6.218972,
      longitude: -75.583639,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    },
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleImageResponse = (response: {
    assets?: Asset[];
    didCancel?: boolean;
    errorMessage?: string;
  }) => {
    if (response.didCancel) {
      Alert.alert('Cancelado', 'No seleccionaste ninguna imagen.');
    } else if (response.errorMessage) {
      Alert.alert('Error', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      const {uri} = response.assets[0];
      setImageUri(uri);
    }
  };

  const handleImageSelection = () => {
    launchImageLibrary(
      {mediaType: 'photo', maxWidth: 800, maxHeight: 600, quality: 0.7},
      handleImageResponse,
    );
    setIsModalVisible(false);
  };

  const handleLaunchCamera = () => {
    launchCamera(
      {mediaType: 'photo', maxWidth: 800, maxHeight: 600, quality: 0.7},
      handleImageResponse,
    );
    setIsModalVisible(false);
  };

const handleSaveContact = async () => {
    if (!name || !number) {
        Alert.alert('Error', 'Por favor completa los campos requeridos.');
        return;
    }

    if (number.length < 10) {
        Alert.alert('Error', 'El número debe tener al menos 10 caracteres.');
        return;
    }

    const nuevoId = contact.id || (await generateContactId());

    const nuevoContacto: IContact = {
        id: nuevoId,
        name,
        email,
        number: Number(number),
        isFavorite: isFavorite ? isFavorite : false,
        image: imageUri,
        role: role,
        location,
    };

    try {
        const contactos = await ContactsService.getContacts();

        const index = contactos.findIndex((c: IContact) => c.id === nuevoContacto.id);

        if (index !== -1) {
            await ContactsService.updateContact(nuevoContacto.id, nuevoContacto);
            Alert.alert('Éxito', `${name} ha sido actualizado correctamente.`);
        } else {
            await ContactsService.addContact(nuevoContacto);
            Alert.alert('Éxito', `${name} ha sido guardado correctamente.`);
        }

        navigation.navigate('Home');
    } catch (error) {
        console.error('Error al guardar el contacto:', error);
        Alert.alert('Error', 'No se pudo guardar el contacto.');
    }
};


    const generateContactId = async (): Promise<number> => {
        const contactos = await ContactsService.getContacts();
        const maxId = contactos.reduce((max: number, contacto: IContact) => Math.max(max, contacto.id), 0);
        return maxId + 1;
    };

  return {
    name,
    setName,
    email,
    setEmail,
    number,
    setNumber,
    isFavorite,
    setIsFavorite,
    imageUri,
    isModalVisible,
    setIsModalVisible,
    handleImageSelection,
    handleLaunchCamera,
    handleSaveContact,
    role,
    setRole,
    location,
    setLocation,
  };
};
