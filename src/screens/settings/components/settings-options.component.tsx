import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { useSettings } from '../hooks/use-settings-options.hook';
import Loader from '../../../utilities/loader.utility';

const SettingsOptions: React.FC = () => {
  const {
    userSettings,
    editable,
    handleEditToggle,
    handleInputChange,
    handleOnPressLogout,
    isLoading,
    handleSaveUser,
  } = useSettings();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={[styles.input, !editable && styles.nonEditableInput]}
        value={userSettings.name}
        editable={editable}
        onChangeText={value => handleInputChange('name', value)}
      />

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={[styles.input, !editable && styles.nonEditableInput]}
        value={userSettings.email}
        editable={editable}
        onChangeText={value => handleInputChange('email', value)}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={[styles.input, !editable && styles.nonEditableInput]}
        value={userSettings.phoneNumber}
        editable={editable}
        onChangeText={value => handleInputChange('phoneNumber', value)}
      />

      <Text style={styles.label}>Ubicación</Text>
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude: userSettings.location.latitude,
          longitude: userSettings.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
        zoomControlEnabled>
        <Marker
          title={userSettings.name}
          coordinate={{
            latitude: userSettings.location.latitude,
            longitude: userSettings.location.longitude,
          }}
          pinColor="skyblue"
        />
      </MapView>

      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={styles.editButton} onPress={editable ? handleSaveUser : handleEditToggle}>
          <Text style={styles.buttonText}>
            {editable ? 'Guardar' : 'Editar'}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleOnPressLogout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginTop: 5,
    color: 'black',
  },
  nonEditableInput: {
    borderWidth: 0,
  },
  mapView: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsOptions;
