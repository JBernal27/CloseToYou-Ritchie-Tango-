import axios from 'axios';

const BackendAxiosInstance = axios.create({
  // baseURL: 'http://192.168.89.207:3000',
  baseURL: 'https://closetoyou-ritchie-tango-bc.up.railway.app/',
  timeout: 5000,
  withCredentials: true,
});

const BackendAxiosInstanceFormData = axios.create({
  // baseURL: 'http://192.168.89.207:3000',
  baseURL: 'https://closetoyou-ritchie-tango-bc.up.railway.app/',
  timeout: 5000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

const WeatherAxiosInstance = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
  timeout: 5000,
});

export { BackendAxiosInstance, WeatherAxiosInstance, BackendAxiosInstanceFormData };
