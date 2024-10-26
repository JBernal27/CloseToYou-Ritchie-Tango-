import React from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Switch, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { RootStackParamList } from '../../router/navigations';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAddContact } from './hooks/use-add-contact.hook';
import { Picker } from '@react-native-picker/picker'; // Importamos Picker
import { Roles } from '../../enum/roles.enum';

type AddContactProps = NativeStackScreenProps<RootStackParamList, 'AddContact'>;

export const AddContact: React.FC<AddContactProps> = ({ route }) => {
    const { contact } = route.params || {};
    const {
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
    } = useAddContact(contact);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={[styles.image]}>
                        <Icon name="add-a-photo" size={100} color={'white'} />
                    </View>
                )}
            </TouchableOpacity>

            <Modal
                transparent
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalContent}>¿Cómo deseas añadir la imagen?</Text>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handleImageSelection}>
                            <Icon name="add-chart" size={50} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLaunchCamera}>
                            <Icon name="add-a-photo" size={50} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                            <Icon name="close" size={50} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Número"
                placeholderTextColor="gray"
                value={number}
                onChangeText={(text) => {
                    const filteredText = text.replace(/[^0-9]/g, '');
                    setNumber(filteredText);
                }}
                keyboardType="phone-pad"
            />

            <View style={styles.favoriteContainer}>
                <Text style={styles.favoriteText}>¿Marcar como favorito?</Text>
                <Switch
                    value={isFavorite}
                    onValueChange={setIsFavorite}
                    trackColor={{ false: '#767577', true: '#767577' }}
                    thumbColor={isFavorite ? '#f5dd4b' : '#f4f3f4'}
                />
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Selecciona un rol:</Text>
                <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}
                    style={styles.picker}
                    dropdownIconColor={'black'}
                >
                    <Picker.Item label={Roles.EMPLEADO} value={Roles.EMPLEADO} />
                    <Picker.Item label={Roles.CLIENTE} value={Roles.CLIENTE} />
                </Picker>
            </View>

            <View style={styles.buttonContainer}>
                <Button title="Guardar Contacto" onPress={handleSaveContact} color="skyblue" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
        gap: 1,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
        color: 'black',
    },
    image: {
        width: 220,
        height: 220,
        borderRadius: 175,
        marginBottom: 15,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
    },
    favoriteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 15,
    },
    favoriteText: {
        fontSize: 16,
        color: 'black',
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    pickerLabel: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
        height: 20,
    },
    picker: {
        width: '100%',
        color: 'black',
        flex: 1,
        backgroundColor: 'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        color: 'black',
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'space-around',
        width: '80%',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

//business-center
//supervised-user-circle
