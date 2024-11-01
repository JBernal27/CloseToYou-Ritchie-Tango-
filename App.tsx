import React from 'react';
import { Navigation } from './src/router/navigations';
//import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {
  // const borrar = async () => {
  //   await AsyncStorage.clear();
  //   console.log('Todos los datos eliminados');
  // };

  // borrar();

  return (
    <Navigation />
  );
}

export default App;
