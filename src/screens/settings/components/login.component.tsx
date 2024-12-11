import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../router/navigations';
import { useLogin } from '../hooks/use-login.hook';
import Loader from '../../../utilities/loader.utility';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { onSubmit, isLoggingIn, isLoading } = useLogin();

  const handleFormSubmit = async (data: LoginFormData) => {
    const isLoginSuccessful = await onSubmit(data.email, data.password);
    if (isLoginSuccessful) {
      navigation.navigate('Home');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/login.png')} style={styles.image} />
      <Text style={styles.title}>Iniciar sesión</Text>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Correo electrónico"
              placeholderTextColor="gray"
            />
          )}
          name="email"
          rules={{
            required: 'El correo electrónico es obligatorio',
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
              message: 'Correo electrónico no válido',
            },
          }}
          defaultValue=""
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Contraseña"
              secureTextEntry
              placeholderTextColor="gray"
            />
          )}
          name="password"
          rules={{
            required: 'La contraseña es obligatoria',
          }}
          defaultValue=""
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit(handleFormSubmit)} disabled={isLoggingIn}>
        <Text style={styles.buttonText}>{isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>¿No tienes una cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    width: '100%',
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: 'skyblue',
    width: '50%',
    height: 30,
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
  image: {
    width: 250,
    height: 250,
  },
  registerButton: {
    marginTop: 15,
  },
  registerText: {
    color: 'skyblue',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
