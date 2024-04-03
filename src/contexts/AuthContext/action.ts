import { IUser } from '@/types/models/IUser';
import { Authorities } from '.';

export enum AuthAction {
  AUTH_ACTION_PENDING = 'AUTH_ACTION_PENDING',
  AUTH_ACTION_FAILURE = 'AUTH_ACTION_FAILURE',

  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGOUT = 'LOGOUT',
  GET_AUTHORITIES = 'GET_AUTHORITIES',
  GET_PROFILE = 'GET_PROFILE',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  CHANGE_PWD = 'CHANGE_PWD'
}

interface AuthActionPending {
  type: AuthAction.AUTH_ACTION_PENDING;
}

interface AuthActionFailure {
  type: AuthAction.AUTH_ACTION_FAILURE;
}

interface LoginSuccess {
  type: AuthAction.LOGIN_SUCCESS;
}

interface Logout {
  type: AuthAction.LOGOUT;
}

interface GetAuthorities {
  type: AuthAction.GET_AUTHORITIES;
  payload: Authorities;
}

interface GetProfile {
  type: AuthAction.GET_PROFILE;
  payload: IUser;
}

interface UpdateProfile {
  type: AuthAction.UPDATE_PROFILE;
}

interface ChangePwd {
  type: AuthAction.CHANGE_PWD;
}

export type AuthActionType =
  | Logout
  | AuthActionPending
  | AuthActionFailure
  | LoginSuccess
  | GetAuthorities
  | GetProfile
  | UpdateProfile
  | ChangePwd;
