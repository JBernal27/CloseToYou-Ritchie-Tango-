import {useForm, SubmitHandler} from 'react-hook-form';
import {IContact} from '../../../interfaces/contact.interface';
import {Roles} from '../../../enum/roles.enum';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../router/navigations';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Alert} from 'react-native';
import {ContactsService} from '../../../services/contacts.service';

export const useAddContact = (
  contact: Partial<IContact> = {
    isFavorite: false,
    image: '',
    role: Roles.EMPLEADO,
  },
) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    register,
    formState: {errors},
  } = useForm<IContact>({
    defaultValues: {
      name: contact.name || '',
      email: contact.email || '',
      number: contact.number?.toString() || '',
      isFavorite: contact.isFavorite || false,
      role: contact.role || Roles.EMPLEADO,
      image: contact.image || '',
      location: contact.location || {
        latitude: 6.218972,
        longitude: -75.583639,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
    },
  });

  const imageUri = watch('image');
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
      setValue('image', uri ? uri : '');
    }
  };

  const handleImageSelection = () => {
    launchImageLibrary(
      {mediaType: 'photo', maxWidth: 800, maxHeight: 600, quality: 0.7},
      handleImageResponse,
    );
  };

  const handleLaunchCamera = () => {
    launchCamera(
      {mediaType: 'photo', maxWidth: 800, maxHeight: 600, quality: 0.7},
      handleImageResponse,
    );
  };

  const handleSaveContact: SubmitHandler<IContact> = async data => {
    if (!data.name || !data.number) {
      Alert.alert('Error', 'Por favor completa los campos requeridos.');
      return;
    }

    const nuevoId = contact.id || (await generateContactId());

    const nuevoContacto: IContact = {
      id: nuevoId,
      name: data.name,
      email: data.email,
      number: data.number,
      isFavorite: data.isFavorite,
      image: data.image,
      role: data.role,
      location: data.location,
    };

    try {
      const contactos = await ContactsService.getContacts();
      const index = contactos.findIndex(
        (c: IContact) => c.id === nuevoContacto.id,
      );

      if (index !== -1) {
        await ContactsService.updateContact(nuevoContacto.id, nuevoContacto);
        Alert.alert('Éxito', `${data.name} ha sido actualizado correctamente.`);
      } else {
        await ContactsService.addContact(nuevoContacto);
        Alert.alert('Éxito', `${data.name} ha sido guardado correctamente.`);
      }

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al guardar el contacto:', error);
      Alert.alert('Error', 'No se pudo guardar el contacto.');
    }
  };

  const generateContactId = async (): Promise<number> => {
    const contactos = await ContactsService.getContacts();
    const maxId = contactos.reduce(
      (max: number, contacto: IContact) => Math.max(max, contacto.id),
      0,
    );
    return maxId + 1;
  };

  register('name', {required: 'El nombre es requerido.'});
  register('email', {
    required: 'El email es requerido.',
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Email no es válido.',
    },
  });
  register('number', {
    required: 'El número es requerido.',
    minLength: {
      value: 10,
      message: 'El número debe tener al menos 10 caracteres.',
    },
  });

  return {
    control,
    handleSubmit,
    handleImageSelection,
    handleLaunchCamera,
    handleSaveContact,
    imageUri,
    getValues,
    setValue,
    errors,
  };
};
