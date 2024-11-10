import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { RootStackParamList } from '../../router/navigations';
import { SettingsService } from '../../services/settings.service'; // Importar el servicio

const styles = {
    image: {
        width: 250,
        height: 250,
    },
};

const OnboardingScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const finishOnboarding = async () => {
        try {
            await SettingsService.updateSetting('isFirstTime', false);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error al finalizar onboarding:', error);
        }
    };

    return (
        <Onboarding
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../../assets/welcome.png')} />,
                    title: 'Bienvenido',
                    subtitle: '¡Gracias por unirte! Todo listo para empezar.',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../../assets/add-contact.png')} />,
                    title: 'Añade Contactos',
                    subtitle: 'Agrega contactos fácilmente en la aplicación.',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../../assets/contacts-location.png')} />,
                    title: 'Ubicación de Contactos',
                    subtitle: 'Establece la ubicación de tus contactos y visualízalos en un mapa.',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../../assets/map.png')} />,
                    title: 'Ver en el Mapa',
                    subtitle: 'Consulta un mapa con todos tus contactos ubicados.',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../../assets/weather.png')} />,
                    title: 'Clima en sus Ubicaciones',
                    subtitle: 'Obtén información sobre el clima en la ubicación de tus contactos.',
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../../assets/start-to-use.png')} />,
                    title: 'Comienza a Usar',
                    subtitle: '¡Listo para empezar a disfrutar de la aplicación!',
                },
            ]}
            onDone={finishOnboarding}
            onSkip={finishOnboarding}
        />
    );
};

export default OnboardingScreen;
