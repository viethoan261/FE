import { BaseModel } from '.';
import { IUser } from './IUser';

export interface IDepartment extends BaseModel {
  code: string;
  name: string;
  description: string;
  parentId?: string;
  users?: IUser[];
}
