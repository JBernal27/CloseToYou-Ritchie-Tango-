import React, { useEffect, useRef } from 'react';
import {StyleSheet, Animated} from 'react-native';

export const contactStyles = StyleSheet.create({
  container: {
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    gap: 15,
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  number: {
    fontSize: 18,
    color: '#666',
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  role: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5,
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  editButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    borderColor: 'skyblue',
    borderWidth: 0.5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  deleteButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    borderColor: '#ff4545',
    borderWidth: 0.5,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 175,
    marginBottom: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapView: {
    width: '100%',
    height: '100%',
  },
  mapViewContainer: {
    overflow: 'hidden',
    width: '100%',
    height: 250,
    borderColor: 'black',
    borderRadius: 10,
    elevation: 8,
    marginBottom: 40,
  },
  markerContainer: {
    borderColor: 'red',
    borderWidth: 3,
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 25,
    backgroundColor: 'red',
  },
});

const PulsingMarker = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={[
        contactStyles.marker,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
};

export default PulsingMarker;
