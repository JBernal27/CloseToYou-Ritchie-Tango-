import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../router/navigations';
import MapSelector from '../add-contact/components/map-selector.component';
import { LatLng } from 'react-native-maps';
import { UserService } from '../../services/users.service';
import { GlobalContext } from '../../utilities/global.context';

interface RegisterFormData {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    location: LatLng;
}

const RegisterScreen: React.FC = () => {
    const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [location, setLocation] = useState<LatLng>({
        latitude: 6.218972,
        longitude: -75.583639,
    });
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(GlobalContext!);

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        const finalData = {
            ...data,
            location: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
        };
        try {
            const newSettings = await UserService.register(finalData);
            context?.setSettings(newSettings);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image source={require('../../assets/register.png')} style={styles.image} />
                <Text style={styles.title}>Registrarse</Text>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: 'El nombre es obligatorio' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre completo"
                                placeholderTextColor="gray"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        defaultValue=""
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: 'El correo electrónico es obligatorio',
                            pattern: {
                                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                message: 'Correo electrónico no válido',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Correo electrónico"
                                placeholderTextColor="gray"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        defaultValue=""
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="phoneNumber"
                        rules={{
                            required: 'El número de teléfono es obligatorio',
                            pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: 'Número de teléfono no válido',
                            },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Número de teléfono"
                                placeholderTextColor="gray"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="phone-pad"
                            />
                        )}
                        defaultValue=""
                    />
                    {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: 'La contraseña es obligatoria',
                            minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Contraseña"
                                placeholderTextColor="gray"
                                secureTextEntry
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        defaultValue=""
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="confirmPassword"
                        rules={{
                            required: 'Confirma tu contraseña',
                            validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar contraseña"
                                placeholderTextColor="gray"
                                secureTextEntry
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        defaultValue=""
                    />
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
                </View>

                <Text style={styles.locationTitle}>Selecciona tu ubicación:</Text>
                <MapSelector location={location} setLocation={setLocation} />

                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.loginText}>¿Ya tienes una cuenta? Inicia Sesion</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
                    <Text style={styles.buttonText}>{isLoading ? 'Cargando...' : 'Registrarse'}</Text>
                </TouchableOpacity>

                {isLoading && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                )}

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        color: '#333',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        color: 'black',
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    button: {
        backgroundColor: 'skyblue',
        width: '50%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginButton: {
        marginTop: 15,
    },
    loginText: {
        color: 'skyblue',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    image: {
        width: 200,
        height: 200,
    },
    locationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'left',
        width: '100%',
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
    },
});

export default RegisterScreen;
