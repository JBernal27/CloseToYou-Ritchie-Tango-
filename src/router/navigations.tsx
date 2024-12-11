import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/home.screen';
import { IContact } from '../interfaces/contact.interface';
import { ContactDetail } from '../screens/contact/contact.screen';
import { AddContact } from '../screens/add-contact/add-contact.screen';
import SettingsScreen from '../screens/settings/settings.screen';
import { MapScreen } from '../screens/map/map.screen';
import OnboardingScreen from '../screens/on-boarding/on-boarding.screen';
import { GlobalContext } from '../utilities/global.context';
import RegisterScreen from '../screens/register/register.screen';

export type RootStackParamList = {
    Home: undefined;
    AddContact?: { contact: Partial<IContact> };
    ContactDetail: { contact: IContact };
    Settings: undefined;
    Map: undefined;
    OnBoarding: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation: React.FC = () => {
    const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList | undefined>();
    const context = useContext(GlobalContext);

    useEffect(() => {
        console.log('Contexto:', context?.settings?.isFirstTime);
        if (context?.settings) {
            if (context.settings.isFirstTime) {
                setInitialRouteName('OnBoarding');
            } else {
                setInitialRouteName('Home');
            }
        }
    }, [context?.settings]);

    if (!initialRouteName) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRouteName}>
                <Stack.Screen name="OnBoarding" component={OnboardingScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
                <Stack.Screen
                    name="AddContact"
                    component={AddContact}
                    options={({ route }) => ({
                        title: route.params ? 'Editando a ' + route.params.contact.name : 'Añadir Contacto',
                    })}
                />
                <Stack.Screen
                    name="ContactDetail"
                    component={ContactDetail}
                    options={({ route }) => ({
                        title: route.params.contact.name,
                    })}
                />
                <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mapa de Contactos' }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes' }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrate' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
