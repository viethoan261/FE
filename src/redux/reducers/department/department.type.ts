import { IDepartment } from '@/types/models/IDepartment';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';

export interface DepartmentState {
  isFetching: boolean;
  departments: IDepartment[];
}

export enum DepartmentActionType {
  DEPARTMENT_ACTION_PENDING = 'DEPARTMENT_ACTION_PENDING',
  DEPARTMENT_ACTION_FAILURE = 'DEPARTMENT_ACTION_FAILURE',

  GET_ALL_DEPARTMENT_SUCCESS = 'GET_ALL_DEPARTMENT_ACTION_SUCCESS',
  CREATE_DEPARTMENT_SUCCESS = 'CREATE_DEPARTMENT_SUCCESS',
  UPDATE_DEPARTMENT_SUCCESS = 'UPDATE_DEPARTMENT_SUCCESS',
  DELETE_DEPARTMENT_SUCCESS = 'DELETE_DEPARTMENT_SUCCESS',
  GET_DETAILS_DEPARTMENT_SUCCESS = 'GET_DETAILS_DEPARTMENT_SUCCESS',
  ADD_USER_SUCCESS = 'ADD_USER_SUCCESS',
  REMOVE_USER_SUCCESS = 'REMOVE_USER_SUCCESS'
}

export interface DepartmentActionPending {
  type: DepartmentActionType.DEPARTMENT_ACTION_PENDING;
}

export interface DepartmentActionFailure {
  type: DepartmentActionType.DEPARTMENT_ACTION_FAILURE;
}

export interface GetAllDepartmentSuccess {
  type: DepartmentActionType.GET_ALL_DEPARTMENT_SUCCESS;
  payload: IDepartment[];
}

export interface CreateDepartmentSuccess {
  type: DepartmentActionType.CREATE_DEPARTMENT_SUCCESS;
}

export interface UpdateDepartmentSuccess {
  type: DepartmentActionType.UPDATE_DEPARTMENT_SUCCESS;
}

export interface DeleteDepartmentSuccess {
  type: DepartmentActionType.DELETE_DEPARTMENT_SUCCESS;
}
export interface GetDetailsDepartmentSuccess {
  type: DepartmentActionType.GET_DETAILS_DEPARTMENT_SUCCESS;
}
export interface AddUserSuccess {
  type: DepartmentActionType.ADD_USER_SUCCESS;
}
export interface RemoveUserSuccess {
  type: DepartmentActionType.REMOVE_USER_SUCCESS;
}

export type DepartmentAction =
  | DepartmentActionPending
  | DepartmentActionFailure
  | GetAllDepartmentSuccess
  | CreateDepartmentSuccess
  | UpdateDepartmentSuccess
  | DeleteDepartmentSuccess
  | GetDetailsDepartmentSuccess
  | AddUserSuccess
  | RemoveUserSuccess;

export type DepartmentThunkAction = ThunkAction<
  void,
  RootState,
  undefined,
  DepartmentAction
>;
