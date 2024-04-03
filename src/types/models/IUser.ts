import { BaseModel } from '.';
import { IRole } from './IRole';

export interface IUser extends BaseModel {
  username: string;
  fullName: string;
  password: string;
  avatar: string;
  dob: string;
  dayOfBirth: string;
  description: string;
  email: string;
  employeeCode: string;
  gender: IUserGender;
  phoneNumber: string;
  status: IUserStatus;
  title: string;
  avatarFileId?: string;
  departmentId: string;
  roles: IRole[];
  roleIds: string[];
}

export enum IUserRole {}

export enum IUserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum IUserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export const IUserStatusDict: Record<
  IUserStatus,
  { label: string; color: string }
> = {
  [IUserStatus.ACTIVE]: {
    label: 'Đang hoạt động',
    color: 'blue'
  },
  [IUserStatus.INACTIVE]: {
    label: 'Dừng hoạt động',
    color: 'orange'
  }
};

export const IUserGenderDict: Record<
  IUserGender,
  { label: string; color: string }
> = {
  [IUserGender.FEMALE]: {
    label: 'Nữ',
    color: 'blue'
  },
  [IUserGender.MALE]: {
    label: 'Nam',
    color: 'orange'
  }
};
