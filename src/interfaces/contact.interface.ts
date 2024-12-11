import { LatLng } from 'react-native-maps';
import {Roles} from '../enum/roles.enum';

export interface IContact {
  id: number;
  name: string;
  number: string;
  email?: string;
  isFavorite: boolean;
  image?: string;
  role: Roles;
  location: LatLng;
}

export interface IContactReq {
  id: number;
  name: string;
  number: string;
  email?: string;
  isFavorite: boolean;
  image?: FormData | null;
  role: Roles;
  latitude: number;
  longitude: number;
}
