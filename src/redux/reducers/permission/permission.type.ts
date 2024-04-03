import { IPermission } from '@/types/models/IPermission';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';

export interface PermissionState {
  isFetching: boolean;
  permission: IPermission[];
}

export enum PermissionActionType {
  PERMISSION_ACTION_PENDING = 'PERMISSION_ACTION_PENDING',
  PERMISSION_ACTION_FAILURE = 'PERMISSION_ACTION_FAILURE',
  GET_ALL_PERMISSION_SUCCESS = 'GET_ALL_PERMISSION_SUCCESS'
}

export interface PermissionActionPending {
  type: PermissionActionType.PERMISSION_ACTION_PENDING;
}

export interface PermissionActionFailure {
  type: PermissionActionType.PERMISSION_ACTION_FAILURE;
}

export interface GetAllPermissionSuccess {
  type: PermissionActionType.GET_ALL_PERMISSION_SUCCESS;
  payload: IPermission[];
}

export type PermissionAction =
  | PermissionActionPending
  | PermissionActionFailure
  | GetAllPermissionSuccess;

export type PermissionThunkAction = ThunkAction<
  void,
  RootState,
  unknown,
  PermissionAction
>;
