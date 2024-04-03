import { IRole } from '@/types/models/IRole';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';

export interface RoleState {
  isFetching: boolean;
  roles: IRole[];
}

export enum RoleActionType {
  ROLE_ACTION_PENDING = 'ROLE_ACTION_PENDING',
  ROLE_ACTION_FAILURE = 'ROLE_ACTION_FAILURE',

  GET_ALL_ROLE_SUCCESS = 'GET_ALL_ROLE_ACTION_SUCCESS',
  CREATE_ROLE_SUCCESS = 'CREATE_ROLE_SUCCESS',
  UPDATE_ROLE_SUCCESS = 'UPDATE_ROLE_SUCCESS',
  DELETE_ROLE_SUCCESS = 'DELETE_ROLE_SUCCESS',
  TOGGLE_ROLE_SUCCESS = 'TOGGLE_ROLE_SUCCESS',
  ASSIGN_PERMISSION_SUCCESS = 'ASSIGN_PERMISSION_SUCCESS',
  GET_DETAILS_ROLE_SUCCESS = 'GET_DETAILS_ROLE_SUCCESS',
  ADD_USER_SUCCESS = 'ADD_USER_SUCCESS',
  REMOVE_USER_SUCCESS = 'REMOVE_USER_SUCCESS'
}

export interface RoleActionPending {
  type: RoleActionType.ROLE_ACTION_PENDING;
}
export interface RoleActionFailure {
  type: RoleActionType.ROLE_ACTION_FAILURE;
}
export interface GetAllRoleSuccess {
  type: RoleActionType.GET_ALL_ROLE_SUCCESS;
  payload: IRole[];
}
export interface CreateRoleSuccess {
  type: RoleActionType.CREATE_ROLE_SUCCESS;
}
export interface UpdateRoleSuccess {
  type: RoleActionType.UPDATE_ROLE_SUCCESS;
}
export interface DeleteRoleSuccess {
  type: RoleActionType.DELETE_ROLE_SUCCESS;
}
export interface ToggleRoleSuccess {
  type: RoleActionType.TOGGLE_ROLE_SUCCESS;
}
export interface AssignPermissionSuccess {
  type: RoleActionType.ASSIGN_PERMISSION_SUCCESS;
}
export interface GetDetailsRoleSuccess {
  type: RoleActionType.GET_DETAILS_ROLE_SUCCESS;
}
export interface AddUserSuccess {
  type: RoleActionType.ADD_USER_SUCCESS;
}
export interface RemoveUserSucces {
  type: RoleActionType.REMOVE_USER_SUCCESS;
}

export type RoleAction =
  | RoleActionPending
  | RoleActionFailure
  | GetAllRoleSuccess
  | CreateRoleSuccess
  | UpdateRoleSuccess
  | DeleteRoleSuccess
  | ToggleRoleSuccess
  | AssignPermissionSuccess
  | GetDetailsRoleSuccess
  | AddUserSuccess
  | RemoveUserSucces;

export type RoleThunkAction = ThunkAction<
  void,
  RootState,
  undefined,
  RoleAction
>;
