import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/home.screen';
import { IContact } from '../interfaces/contact.interface';
import { ContactDetail } from '../screens/contact/contact.screen';
import { AddContact } from '../screens/add-contact/add-contact.screen';
import SettingsScreen from '../screens/settings/settings.screen';
import { MapScreen } from '../screens/map/map.screen';

export type RootStackParamList = {
    Home: undefined;
    AddContact?: { contact: Partial<IContact> };
    ContactDetail: { contact: IContact };
    Settings: undefined;
    Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen
                    name="AddContact"
                    component={AddContact}
                    options={({ route }) => ({
                        title: route.params ? 'Editando a ' +  route.params.contact.name : 'Añadir Contacto',
                    })}
                />
                <Stack.Screen
                    name="ContactDetail"
                    component={ContactDetail}
                    options={({ route }) => ({
                        title: route.params.contact.name,
                    })}
                />
                <Stack.Screen
                    name="Map"
                    component={MapScreen}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
