import React from 'react';
import { View, TextInput, Button, ScrollView, Switch, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAddContact } from './hooks/use-add-contact.hook';
import { Dropdown } from 'react-native-element-dropdown';
import { Roles } from '../../enum/roles.enum';
import { addContactStyles } from './styles/add-contact.styles';
import MapSelector from './components/map-selector.component';
import { Controller } from 'react-hook-form';
import { RootStackParamList } from '../../router/navigations';
import Loader from '../../utilities/loader.utility';

type AddContactProps = NativeStackScreenProps<RootStackParamList, 'AddContact'>;

export const AddContact: React.FC<AddContactProps> = ({ route }) => {
  const { contact } = route.params || {};
  const {
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
    isLoading,
  } = useAddContact(contact);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ScrollView contentContainerStyle={addContactStyles.container}>
      <TouchableOpacity onPress={() => setIsModalOpen(true)}>
        {image ? (
          <Image source={{ uri: image }} style={addContactStyles.image} />
        ) : (
          <View style={[addContactStyles.image]}>
            <Icon name="add-a-photo" size={100} color={'white'} />
          </View>
        )}
      </TouchableOpacity>

      <Modal
        transparent
        visible={isModalOpen}
        animationType="fade"
        onRequestClose={() => { }}
      >
        <View style={addContactStyles.modalContainer}>
          <View style={addContactStyles.modalContent}>
            <Text style={addContactStyles.modalContent}>¿Cómo deseas añadir la imagen?</Text>
            <View style={addContactStyles.modalButtonsContent}>
              <TouchableOpacity onPress={handleImageSelection}>
                <Icon name="add-chart" size={50} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLaunchCamera}>
                <Icon name="add-a-photo" size={50} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Icon name="close" size={50} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={addContactStyles.inputCointainer}>
            {errors.name && <Text style={addContactStyles.errorText}>{errors.name.message}</Text>}
            <TextInput
              style={addContactStyles.input}
              placeholder="Nombre*"
              placeholderTextColor="gray"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={addContactStyles.inputCointainer}>
            {errors.email && <Text style={addContactStyles.errorText}>{errors.email.message}</Text>}
            <TextInput
              style={addContactStyles.input}
              placeholder="Email"
              placeholderTextColor="gray"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="number"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={addContactStyles.inputCointainer}>
            {errors.number && <Text style={addContactStyles.errorText}>{errors.number.message}</Text>}
            <TextInput
              style={addContactStyles.input}
              placeholder="Número*"
              placeholderTextColor="gray"
              onBlur={onBlur}
              onChangeText={(text) => {
                const filteredText = text.replace(/[^0-9]/g, '');
                onChange(filteredText);
              }}
              value={value}
              keyboardType="numeric"
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="isFavorite"
        render={({ field: { onChange, value } }) => (
          <View style={addContactStyles.favoriteContainer}>
            <Text style={addContactStyles.favoriteText}>¿Marcar como favorito?</Text>
            <Switch
              value={value}
              onValueChange={onChange}
              trackColor={{ false: '#767577', true: '#767577' }}
              thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        )}
      />

      <View style={addContactStyles.pickerContainer}>
        <Text style={addContactStyles.pickerLabel}>Selecciona un rol:</Text>
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              style={addContactStyles.dropdown}
              placeholderStyle={addContactStyles.placeholderStyle}
              selectedTextStyle={addContactStyles.selectedTextStyle}
              itemTextStyle={addContactStyles.selectedTextStyle}
              data={[
                { label: Roles.EMPLEADO, value: Roles.EMPLEADO },
                { label: Roles.CLIENTE, value: Roles.CLIENTE },
              ]}
              labelField="label"
              valueField="value"
              value={value}
              onChange={item => onChange(item.value)}
            />
          )}
        />
      </View>

      <MapSelector location={location} setLocation={setLocation} />
      <View style={addContactStyles.buttonContainer}>
        <Button title="Guardar Contacto" onPress={handleSubmit(handleSaveContact)} color="skyblue" />
      </View>
    </ScrollView>
  );
};
