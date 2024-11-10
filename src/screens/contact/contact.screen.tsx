import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Alert, SafeAreaView, Image, ScrollView } from 'react-native';
import { RootStackParamList } from '../../router/navigations';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatPhoneNumber } from '../../utilities/format-number.utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Roles } from '../../enum/roles.enum';
import MapView, { Marker } from 'react-native-maps';
import { contactStyles } from './styles/contact.styles';
import { ContactsService } from '../../services/contacts.service.ts';
import { WeatherComponent } from './components/weather.component.tsx';
import DefaultMarker from './styles/contact.styles';

type ContactDetailProps = NativeStackScreenProps<RootStackParamList, 'ContactDetail'>;

export const ContactDetail: React.FC<ContactDetailProps> = ({ route }) => {
    const { contact } = route.params;
    const navigate = useNavigation<NavigationProp<RootStackParamList>>();
    const [isFavorite, setIsFavorite] = useState(contact.isFavorite);

    console.log('contact');
    const toggleFavorite = async () => {
        try {
            const contactos = await ContactsService.getContacts();
            const contacto = contactos.find(c => c.id === contact.id);
            if (contacto) {
                const updatedContact = { ...contacto, isFavorite: !contacto.isFavorite };
                await ContactsService.updateContact(contact.id, updatedContact);
                setIsFavorite(!isFavorite); // Actualiza el estado local
            }
        } catch (error) {
            console.error('Error al cambiar favorito:', error);
        }
    };

    const onDelete = async (contactNumber: string) => {
        try {
            const contactos = await ContactsService.getContacts();
            const contacto = contactos.find(c => c.number === contactNumber);
            if (contacto) {
                await ContactsService.deleteContact(contacto.id);
                navigate.navigate('Home');
            }
        } catch (error) {
            console.error('Error al eliminar el contacto:', error);
        }
    };


    return (
        <ScrollView>
            <SafeAreaView style={contactStyles.container}>
                {contact.image ? (
                    <Image source={{ uri: contact.image }} style={contactStyles.image} />
                ) : (
                    <View style={contactStyles.image}>
                        <Icon name="person" size={100} color={'white'} />
                    </View>
                )}
                <View style={contactStyles.infoContainer}>
                    <View style={contactStyles.nameContainer}>
                        <Text style={contactStyles.name}>
                            {contact.name}
                        </Text>
                        <TouchableOpacity onPress={toggleFavorite}>
                            {isFavorite ? (
                                <Icon name="star" color={'#f4d03f'} size={35} />
                            ) : (
                                <Icon name="star-border" color={'#f4d03f'} size={35} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text style={contactStyles.number}>{formatPhoneNumber(contact.number)}</Text>
                    <View style={contactStyles.role}>
                        <Text style={contactStyles.email}>{contact.role}</Text>
                        {contact.role === Roles.CLIENTE ?
                            <Icon name="business-center" color={'gray'} size={25} />
                            :
                            <Icon name="supervised-user-circle" color={'gray'} size={25} />
                        }
                    </View>
                    {contact.email && <Text style={contactStyles.email}>{contact.email}</Text>}
                </View>
                <WeatherComponent longitude={contact.location.longitude} latitude={contact.location.latitude} />
                <View style={contactStyles.mapViewContainer}>
                    <MapView
                        style={contactStyles.mapView}
                        initialRegion={{
                            ...contact.location,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        showsUserLocation
                        showsMyLocationButton
                        loadingEnabled
                        zoomControlEnabled
                    >
                        <Marker
                            title={contact.name}
                            description={`Celular: ${formatPhoneNumber(contact.number)}`}
                            coordinate={contact.location}
                            pinColor="skyblue"
                            opacity={1}
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={contactStyles.markerContainer}>
                                {
                                    contact.image ?
                                        <Image
                                            source={{ uri: contact.image }}
                                            style={contactStyles.markerImage}
                                        />
                                        :
                                        <DefaultMarker name={contact.name} />
                                }
                            </View>
                        </Marker>
                    </MapView>
                </View>
                <TouchableOpacity
                    style={[contactStyles.button, contactStyles.editButton]}
                    onPress={() => navigate.navigate('AddContact', { contact })}
                >
                    <Text style={contactStyles.buttonText}><Icon name="edit" size={30} color={'skyblue'} /></Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[contactStyles.button, contactStyles.deleteButton]}
                    onPress={() =>
                        Alert.alert('Confirmar Eliminación', '¿Estás seguro de que quieres eliminar este contacto?', [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Eliminar', onPress: () => onDelete(contact.number), style: 'destructive' },
                        ])
                    }
                >
                    <Text style={contactStyles.buttonText}><Icon name="delete" size={30} color={'#ff4545'} /></Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
};
