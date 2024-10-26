import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, SafeAreaView, Image } from 'react-native';
import { RootStackParamList } from '../../router/navigations';
import { IContact } from '../../interfaces/contact.interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatPhoneNumber } from '../../utilities/format-number.utility';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Roles } from '../../enum/roles.enum';

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
        <SafeAreaView style={styles.container}>
            {contact.image ? (
                <Image source={{ uri: contact.image }} style={styles.image} />
            ) : (
                <View style={styles.image}>
                    <Icon name="person" size={100} color={'white'} />
                </View>
            )}
            <View style={styles.infoContainer}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>
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
                <Text style={styles.number}>{formatPhoneNumber(contact.number)}</Text>
                <View style={styles.role}>
                    <Text style={styles.email}>{contact.role}</Text>
                    {contact.role === Roles.CLIENTE ?
                        <Icon name="business-center" color={'gray'} size={25} />
                        :
                        <Icon name="supervised-user-circle" color={'gray'} size={25} />
                    }
                </View>
                {contact.email && <Text style={styles.email}>{contact.email}</Text>}
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => navigate.navigate('AddContact', { contact })}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() =>
                        Alert.alert('Confirmar Eliminación', '¿Estás seguro de que quieres eliminar este contacto?', [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Eliminar', onPress: () => onDelete(contact.number), style: 'destructive' },
                        ])
                    }
                >
                    <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
        gap: 15,
        marginTop: 25,
    },
    infoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    number: {
        fontSize: 18,
        color: '#666',
    },
    email: {
        fontSize: 16,
        color: '#888',
    },
    role: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 5,
    },
    editButton: {
        backgroundColor: 'skyblue',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 175,
        marginBottom: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
