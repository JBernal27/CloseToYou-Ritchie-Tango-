import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IContact } from '../../../interfaces/contact.interface';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../router/navigations';
import { formatPhoneNumber } from '../../../utilities/format-number.utility';

export default function ContactCard(contact: IContact) {
    const navigate = useNavigation<NavigationProp<RootStackParamList>>();

    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            flexDirection: 'row',
            height: 60,
            borderColor: 'black',
            borderWidth: 0.5,
            alignItems: 'center',
            paddingHorizontal: 10,
            gap: 15,
            margin: 10,
        },
        textBox: {
            flexDirection: 'column',
            flex: 1,
        },
        contactName: {
            color: 'black',
            fontWeight: 'bold',
            fontSize: 20,
        },
        contactNumber: {
            color: 'black',
        },
        contactPicture: {
            borderRadius: 50,
            height: 45,
            width: 45,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: generarColorAleatorio(),
        },
    });

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigate.navigate('ContactDetail', { contact: contact })}
        >
            {contact.image ?
                <Image
                    source={{ uri: contact.image }}
                    style={styles.contactPicture}
                />
                :
                <View style={styles.contactPicture}>
                    <Icon name="person" size={30} color={'white'} />
                </View>
            }
            <View style={styles.textBox}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{formatPhoneNumber(contact.number)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const generarColorAleatorio = () => {
    const numeroAleatorio = Math.floor(Math.random() * 16777215);
    return `#${numeroAleatorio.toString(16).padStart(6, '0')}`;
};
