import React from 'react';
import { ActivityIndicator, View, Dimensions, StyleSheet } from 'react-native';

// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Definir las unidades vh y vw
const vh = height / 100;
const vw = width / 100;

export default function Loader() {
  return (
    <View style={[styles.loaderContainer, { height: 100 * vh, width: 100 * vw }]}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
