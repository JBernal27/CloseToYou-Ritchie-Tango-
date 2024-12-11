import React from 'react';
import { Navigation } from './src/router/navigations';
import { GlobalProvider } from './src/utilities/global.context';
import Snackbar from './src/utilities/components/snackbar.utility';
//import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {
  // const borrar = async () => {
  //   await AsyncStorage.clear();
  //   console.log('Todos los datos eliminados');
  // };

  // borrar();

  return (
    <GlobalProvider>
      <Navigation/>
      <Snackbar />
    </GlobalProvider>
  );
}

export default App;
