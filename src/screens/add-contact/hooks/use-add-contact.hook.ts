import { useForm, SubmitHandler } from 'react-hook-form';
import { IContact, IContactReq } from '../../../interfaces/contact.interface';
import { Roles } from '../../../enum/roles.enum';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../router/navigations';
import {
  Asset,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useContext, useState } from 'react';
import { LatLng } from 'react-native-maps';
import { ContactsService } from '../../../services/contacts.service';
import { GlobalContext } from '../../../utilities/global.context';

export const useAddContact = (
  contact: Partial<IContact> = {
    isFavorite: false,
    image: '',
    role: Roles.EMPLEADO,
  },
) => {
  const context = useContext(GlobalContext!);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location, setLocation] = useState<LatLng>(
    contact.location || {
      latitude: 6.218972,
      longitude: -75.583639,
    },
  );
  const [image, setImage] = useState<string>(contact.image || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
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
      },
    },
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleImageResponse = (response: {
    assets?: Asset[];
    didCancel?: boolean;
    errorMessage?: string;
  }) => {
    if (response.didCancel) {
      context?.setSnackbarInfo({
        message: 'No seleccionaste ninguna imagen.',
        type: 'info',
        isVisible: true,
      });
    } else if (response.errorMessage) {
      context?.setSnackbarInfo({
        message: `Error: ${response.errorMessage}`,
        type: 'error',
        isVisible: true,
      });
    } else if (response.assets && response.assets.length > 0) {
      const { uri } = response.assets[0];
      setImage(uri ? uri : '');
    }
  };

  const handleImageSelection = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 800, maxHeight: 600, quality: 0.7 },
      handleImageResponse,
    );
  };

  const handleLaunchCamera = () => {
    launchCamera(
      { mediaType: 'photo', maxWidth: 800, maxHeight: 600, quality: 0.7 },
      handleImageResponse,
    );
  };

  const handleSaveContact: SubmitHandler<IContact> = async data => {
    setIsLoading(true);

    if (!data.name || !data.number) {
      context?.setSnackbarInfo({
        message: 'Por favor completa los campos requeridos.',
        type: 'error',
        isVisible: true,
      });
      setIsLoading(false);
      return;
    }

    const nuevoId = contact.id || (await generateContactId());

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email || '');
    formData.append('number', data.number);
    formData.append('isFavorite', data.isFavorite ? 'true' : 'false');
    formData.append('role', data.role);
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());

    if (image) {
      formData.append('image', {
        uri: image,
        name: `contact-${nuevoId}.jpg`,
        type: 'image/jpg',
      });
    }

    try {
      const contactos = await ContactsService.getContacts();
      const index = contactos.findIndex((c: IContact) => c.id === nuevoId);

      if (index !== -1) {
        await ContactsService.updateContact(nuevoId, formData, {
          ...data,
          id: nuevoId,
          image,
        });
        context?.setSnackbarInfo({
          duration: 3500,
          message: `${data.name} ha sido actualizado correctamente.`,
          type: 'success',
          isVisible: true,
        });
      } else {
        await ContactsService.addContact(formData, {
          ...data,
          id: nuevoId,
          image,
        });
        context?.setSnackbarInfo({
          message: `${data.name} ha sido guardado correctamente.`,
          type: 'success',
          isVisible: true,
        });
      }

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al guardar el contacto:', error);
      context?.setSnackbarInfo({
        message: 'No se pudo guardar el contacto.',
        type: 'error',
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
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

  register('name', { required: 'El nombre es requerido.' });
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
    errors,
    isModalOpen,
    setIsModalOpen,
    location,
    setLocation,
    image,
    setImage,
    isLoading,
  };
};
