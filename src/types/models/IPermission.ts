import { BaseModel } from '.';

export interface IPermission extends BaseModel {
  name: string;
  resourceName: string;
  resourceCode: string;
  priority: number;
  scope: IPermissionScope;
}

export enum IPermissionScope {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  REVIEW = 'REVIEW',
  AUDIT = 'AUDIT',
  RESOLVE = 'RESOLVE',
  REPORT = 'REPORT',
  APPROVE = 'APPROVE',
  EXPORT = 'EXPORT'
}
