import {LatLng} from 'react-native-maps';

export interface IUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: LatLng;
}
