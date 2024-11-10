import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../screens/home/home.screen';
import { IContact } from '../interfaces/contact.interface';
import { ContactDetail } from '../screens/contact/contact.screen';
import { AddContact } from '../screens/add-contact/add-contact.screen';
import SettingsScreen from '../screens/settings/settings.screen';
import { MapScreen } from '../screens/map/map.screen';
import OnboardingScreen from '../screens/on-boarding/on-boarding.screen';

export type RootStackParamList = {
    Home: undefined;
    AddContact?: { contact: Partial<IContact> };
    ContactDetail: { contact: IContact };
    Settings: undefined;
    Map: undefined;
    OnBoarding: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation: React.FC = () => {
    const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList | undefined>();

    useEffect(() => {
        const checkFirstTime = async () => {
            const isFirstTime = await AsyncStorage.getItem('isFirstTime');
            if (isFirstTime === null) {
                await AsyncStorage.setItem('isFirstTime', 'false');
                setInitialRouteName('OnBoarding');
            } else {
                setInitialRouteName('Home');
            }
        };
        checkFirstTime();
    }, []);

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
                <Stack.Screen name="Map" component={MapScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
