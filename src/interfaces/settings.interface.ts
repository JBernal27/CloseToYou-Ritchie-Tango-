import {IUser} from './user.interface';

export interface ISettings extends IUser {
  id: number;
  isFirstTime: boolean;
  token: string;
  wantsBackup: boolean;
}
