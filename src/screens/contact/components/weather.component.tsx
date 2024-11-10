import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getWeatherData } from '../../../services/weather.service';
import { LatLng } from 'react-native-maps';
import { IWeatherData } from '../../../interfaces/weather.interface';

export const WeatherComponent = (location: LatLng) => {
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('lece');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWeatherData(location.latitude, location.longitude);
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!weatherData) {
    return <Text>No weather data available.</Text>;
  }

  const { temp, temp_min, temp_max } = weatherData.main;
  const description = weatherData.weather[0].description;

  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <View style={styles.weatherInfoContainer}>
          <View style={styles.leftSection}>
            <Text style={styles.city}>{weatherData.name}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }}
            style={styles.icon}
          />
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.temperature}>{temp}°C</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Max: {temp_max}°C</Text>
        <Text style={styles.footerText}>Min: {temp_min}°C</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    margin: 5,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  leftSection: {
    flexDirection: 'column',
  },
  city: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  rightSection: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  icon: {
    width: 50,
    height: 50,
  },
  weatherInfoContainer:{
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

