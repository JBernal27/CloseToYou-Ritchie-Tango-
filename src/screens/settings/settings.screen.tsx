import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import { GlobalContext } from '../../utilities/global.context';
import LoginComponent from './components/login.component';
import SettingsOptions from './components/settings-options.component';

export default function SettingsScreen() {
  const context = useContext(GlobalContext!);

  return (
    <ScrollView style={{ backgroundColor: 'white', minHeight: '100%' }}>
      {context?.settings?.token ?
        <SettingsOptions/>
        :
        <LoginComponent />
      }
    </ScrollView>
  );
}
