import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Region, LatLng } from 'react-native-maps';
import { addContactStyles } from '../styles/add-contact.styles';

const initialRegion: Region = {
  latitude: 6.218972,
  longitude: -75.583639,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

interface Props {
  location: Region
  setLocation: React.Dispatch<React.SetStateAction<Region>>
}

export default function MapSelector({ location, setLocation }: Props): JSX.Element {

  const handleMapPress = (event: any): void => {
    setLocation(event.nativeEvent.coordinate);
  };

  return (
    <View style={addContactStyles.mapViewContainer}>
      <MapView
        style={addContactStyles.mapView}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        showsPointsOfInterest
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
      >
        {location && (
          <Marker
            coordinate={location as LatLng}
            description={`Lat: ${location.latitude}, Lng: ${location.longitude}`}
            pinColor="skyblue"
            opacity={0.7}
          />
        )}
      </MapView>
      {location && (
        <View style={addContactStyles.infoBox}>
          <Text style={addContactStyles.infoText}>
            Punto seleccionado: {location.latitude}, {location.longitude}
          </Text>
        </View>
      )}
    </View>
  );
}
