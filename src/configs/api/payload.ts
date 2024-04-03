import { INewStatus } from '@/types/models/INew';
import { IRoleProperty } from '@/types/models/IRole';
import { IUserGender } from '@/types/models/IUser';

export type LoginPayload = {
  username: string;
  password: string;
};

export type ChangeProfilePayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: IUserGender;
  description: string;
  dayOfBirth: string;
  avatarFileId: string;
  roleIds: string[];
  departmentId: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: IUserGender;
  roleIds: string[];
  departmentId: string;
  description: string;
  dayOfBirth: string | undefined;
  avatar: string;
};

export type ChangePwdPayload = {
  password: string;
};

export type CreateDepartmentPayload = {
  name: string;
  description: string;
  parentId?: string;
};

export type UpdateDepartmentPayload = CreateDepartmentPayload;

export type CreateRolePayload = {
  name: string;
  description: string;
  isRoot: boolean;
  properties: IRoleProperty[];
};

export type UpdateRolePayload = CreateRolePayload;

export type AssignRolePermissionPayload = {
  permissionIds: string[];
};

export type RequestTimeoffPayload = {
  type: string;
  note?: string;
  dateFrom: string;
  dateTo: string;
  start?: number;
  end?: number;
  dayOff: number;
  fileId?: string;
};

export type CreateNewsPayload = {
  title: string;
  content: string;
  isPublic?: boolean;
  status?: INewStatus;
  isImportant?: boolean;
  employeeIds?: string[];
};
export type ApiEndPointPayload =
  | LoginPayload
  | RegisterPayload
  | CreateDepartmentPayload
  | CreateRolePayload
  | AssignRolePermissionPayload
  | ChangeProfilePayload
  | string[]
  | RequestTimeoffPayload
  | CreateNewsPayload
  | ChangePwdPayload;
