// import axios from 'axios';
import {IWeatherData} from '../interfaces/weather.interface';
import {WEATHER_API_KEY} from '@env';
import {WeatherAxiosInstance} from '../../axios.config';

export const getWeatherData = async (lat: number, lon: number) => {
  try {
    const response = await WeatherAxiosInstance.get('', {
      params: {
        lat: lat,
        lon: lon,
        appid: WEATHER_API_KEY,
        units: 'metric',
        lang: 'es',
      },
    });

    return response.data as IWeatherData;
  } catch (error) {
    console.error('Error al obtener los datos del clima:', error);
    throw error;
  }
};

// WeatherAxiosInstance.interceptors.request.use(request => {
//   console.log('Starting Request', request);
//   return request;
// });

// WeatherAxiosInstance.interceptors.response.use(
//   response => {
//     console.log('Response:', response);
//     return response;
//   },
//   error => {
//     console.error('Error Response:', error);
//     return Promise.reject(error);
//   },
// );
