import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Alert, SafeAreaView, Image } from 'react-native';
import { RootStackParamList } from '../../router/navigations';
import { IContact } from '../../interfaces/contact.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatPhoneNumber } from '../../utilities/format-number.utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Roles } from '../../enum/roles.enum';
import { contactStyles } from './styles/contact.styles';

type ContactDetailProps = NativeStackScreenProps<RootStackParamList, 'ContactDetail'>;

export const ContactDetail: React.FC<ContactDetailProps> = ({ route }) => {
    const { contact } = route.params;
    const navigate = useNavigation<NavigationProp<RootStackParamList>>();
    const [isFavorite, setIsFavorite] = useState(contact.isFavorite);

    const toggleFavorite = async () => {
        try {
            const savedContacts = await AsyncStorage.getItem('contactos');
            if (savedContacts) {
                const parsedContacts = JSON.parse(savedContacts) as IContact[];
                const updatedContacts = parsedContacts.map(c =>
                    c.id === contact.id ? { ...c, isFavorite: !c.isFavorite } : c
                );

                await AsyncStorage.setItem('contactos', JSON.stringify(updatedContacts));
                setIsFavorite(!isFavorite); // Actualiza el estado para reflejar el cambio
            }
        } catch (error) {
            console.error('Error al cambiar favorito:', error);
        }
    };

    const onDelete = async (contactNumber: number) => {
        try {
            const savedContacts = await AsyncStorage.getItem('contactos');
            if (savedContacts) {
                const parsedContacts = JSON.parse(savedContacts) as IContact[];
                const updatedContacts = parsedContacts.filter(contacto => contacto.number !== contactNumber);
                await AsyncStorage.setItem('contactos', JSON.stringify(updatedContacts));
                navigate.navigate('Home');
            }
        } catch (error) {
            console.error('Error al eliminar el contacto:', error);
        }
    };

    return (
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
                            <Icon name="star" color={'skyblue'} size={35} />
                        ) : (
                            <Icon name="star-border" color={'skyblue'} size={35} />
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
            <View style={contactStyles.buttonsContainer}>
                <TouchableOpacity
                    style={[contactStyles.button, contactStyles.editButton]}
                    onPress={() => navigate.navigate('AddContact', { contact })}
                >
                    <Text style={contactStyles.buttonText}>Editar</Text>
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
                    <Text style={contactStyles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
