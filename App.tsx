import React from 'react';
import { Navigation } from './src/router/navigations';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {
  // const borrar = async () => {
  //   await AsyncStorage.clear();
  //   console.log('Todos los datos eliminados');
  // };

  // borrar();

  const migrateContacts = async () => {
    try {
      const oldContacts = await AsyncStorage.getItem('contactos');

      if (oldContacts) {
        await AsyncStorage.setItem('contacts', oldContacts); // Guarda bajo la nueva clave
        await AsyncStorage.removeItem('contactos'); // Elimina la clave antigua
        console.log('Migración de contactos completada exitosamente.');
      } else {
        console.log('No se encontraron contactos para migrar.');
      }
    } catch (error) {
      console.error('Error al migrar contactos:', error);
    }
  };

  migrateContacts();
  return (
    <Navigation />
  );
}

export default App;
