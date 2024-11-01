import axios from 'axios';
import { IWeatherData } from '../interfaces/weather.interface';
import { WEATHER_API_KEY } from '@env';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherData = async (lat: number, lon:number) => {
  try {
    const response = await axios.get(BASE_URL, {
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

// axios.interceptors.request.use((request) => {
//   console.log('Starting Request', request);
//   return request;
// });

// axios.interceptors.response.use(
//   (response) => {
//     console.log('Response:', response);
//     return response;
//   },
//   (error) => {
//     console.error('Error Response:', error);
//     return Promise.reject(error);
//   }
// );
