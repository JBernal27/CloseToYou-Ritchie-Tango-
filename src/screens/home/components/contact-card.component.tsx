import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IContact } from '../../../interfaces/contact.interface';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../router/navigations';
import { formatPhoneNumber } from '../../../utilities/format-number.utility';
import { Roles } from '../../../enum/roles.enum';

export default function ContactCard(contact: IContact) {
    const navigate = useNavigation<NavigationProp<RootStackParamList>>();

    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            flexDirection: 'row',
            height: 60,
            // borderColor: 'black',
            // borderWidth: 0.5,
            elevation: 8,
            alignItems: 'center',
            paddingHorizontal: 10,
            gap: 15,
            margin: 10,
            backgroundColor: '#f5f5f5',
        },
        textBox: {
            flexDirection: 'column',
            flex: 1,
        },
        iconBox: {
            width: 30,
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
            <View style={styles.iconBox}>
                {contact.role === Roles.CLIENTE ?
                <Icon name="business-center" color={'gray'} size={25}/>
                :
                <Icon name="supervised-user-circle" color={'gray'} size={25}/>
                }
            </View>
        </TouchableOpacity>
    );
}

const generarColorAleatorio = () => {
    const numeroAleatorio = Math.floor(Math.random() * 16777215);
    return `#${numeroAleatorio.toString(16).padStart(6, '0')}`;
};
