import {Roles} from '../enum/roles.enum';

export interface IContact {
  id: number;
  name: string;
  number: number;
  email?: string;
  isFavorite: boolean;
  image?: string;
  role: Roles;
}
