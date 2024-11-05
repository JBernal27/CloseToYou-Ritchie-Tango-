  import React from 'react';
  import { View, Text } from 'react-native';
  import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
  import { addContactStyles } from '../styles/add-contact.styles';

  interface Props {
    location: Region;
    setLocation: React.Dispatch<React.SetStateAction<Region>>;
  }

  export default function MapSelector({ location, setLocation }: Props): JSX.Element {
    const initialRegion: Region = {
      ...location,
      latitudeDelta: location.latitudeDelta || 0.01,
      longitudeDelta: location.longitudeDelta || 0.01,
    };

    const [currentLocation, setCurrentLocation] = React.useState<Region>(initialRegion);

    const handleMapPress = (event: MapPressEvent): void => {
      const { latitude, longitude } = event.nativeEvent.coordinate;

      setCurrentLocation({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setLocation(currentLocation);
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
              coordinate={currentLocation}
              pinColor="skyblue"
              opacity={0.7}
              title="Punto Seleccionado"
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
