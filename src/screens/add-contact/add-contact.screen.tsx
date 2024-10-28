import React from 'react';
import { View, TextInput, Button, ScrollView, Switch, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { RootStackParamList } from '../../router/navigations';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAddContact } from './hooks/use-add-contact.hook';
import { Picker } from '@react-native-picker/picker'; // Importamos Picker
import { Roles } from '../../enum/roles.enum';
import { addContactStyles } from './styles/add-contact.styles';
import MapSelector from './components/map-selector.component';

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
        location,
        setLocation,
    } = useAddContact(contact);

    return (
        <ScrollView contentContainerStyle={addContactStyles.container}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={addContactStyles.image} />
                ) : (
                    <View style={[addContactStyles.image]}>
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
                <View style={addContactStyles.modalContainer}>
                    <Text style={addContactStyles.modalContent}>¿Cómo deseas añadir la imagen?</Text>
                    <View style={addContactStyles.modalContent}>
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
                style={addContactStyles.input}
                placeholder="Nombre"
                placeholderTextColor="gray"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={addContactStyles.input}
                placeholder="Email"
                placeholderTextColor="gray"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={addContactStyles.input}
                placeholder="Número"
                placeholderTextColor="gray"
                value={number}
                onChangeText={(text) => {
                    const filteredText = text.replace(/[^0-9]/g, '');
                    setNumber(filteredText);
                }}
                keyboardType="phone-pad"
            />

            <View style={addContactStyles.favoriteContainer}>
                <Text style={addContactStyles.favoriteText}>¿Marcar como favorito?</Text>
                <Switch
                    value={isFavorite}
                    onValueChange={setIsFavorite}
                    trackColor={{ false: '#767577', true: '#767577' }}
                    thumbColor={isFavorite ? '#f5dd4b' : '#f4f3f4'}
                />
            </View>

            <View style={addContactStyles.pickerContainer}>
                <Text style={addContactStyles.pickerLabel}>Selecciona un rol:</Text>
                <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}
                    style={addContactStyles.picker}
                    dropdownIconColor={'black'}
                >
                    <Picker.Item label={Roles.EMPLEADO} value={Roles.EMPLEADO} />
                    <Picker.Item label={Roles.CLIENTE} value={Roles.CLIENTE} />
                </Picker>
            </View>
                <MapSelector location={location} setLocation={setLocation} />
            <View style={addContactStyles.buttonContainer}>
                <Button title="Guardar Contacto" onPress={handleSaveContact} color="skyblue" />
            </View>
        </ScrollView>
    );
};
