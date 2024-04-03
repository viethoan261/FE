import { IUser } from '@/types/models/IUser';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';

export interface UserState {
  isFetching: boolean;
  users: IUser[];
}

export enum UserActionType {
  USER_ACTION_PENDING = 'USER_ACTION_PENDING',
  USER_ACTION_FAILURE = 'USER_ACTION_FAILURE',

  GET_ALL_USER_SUCCESS = 'GET_ALL_USER_ACTION_SUCCESS',
  CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS',
  UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
  DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS'
}

export interface UserActionPending {
  type: UserActionType.USER_ACTION_PENDING;
}

export interface UserActionFailure {
  type: UserActionType.USER_ACTION_FAILURE;
}

export interface GetAllUserSuccess {
  type: UserActionType.GET_ALL_USER_SUCCESS;
  payload: IUser[];
}

export interface CreateUserSuccess {
  type: UserActionType.CREATE_USER_SUCCESS;
}

export interface UpdateUserSuccess {
  type: UserActionType.UPDATE_USER_SUCCESS;
}

export interface DeleteUserSuccess {
  type: UserActionType.DELETE_USER_SUCCESS;
}

export type UserAction =
  | UserActionPending
  | UserActionFailure
  | GetAllUserSuccess
  | CreateUserSuccess
  | UpdateUserSuccess
  | DeleteUserSuccess;

export type UserThunkAction = ThunkAction<
  void,
  RootState,
  undefined,
  UserAction
>;
