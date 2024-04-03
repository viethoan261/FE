import { IAttendance } from '@/types/models/IAttendance';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';

export interface AttendanceState {
  isFetching: boolean;
  attendances: IAttendance[];
  myAttendances: IAttendance[];
}

export enum AttendanceActionType {
  ATTENDANCE_ACTION_PENDING = 'ATTENDANCE_ACTION_PENDING',
  ATTENDANCE_ACTION_FAILURE = 'ATTENDANCE_ACTION_FAILURE',

  GET_ALL_ATTENDANCE = 'GET_ALL_ATTENDANCE',
  GET_MY_ATTENDACE = 'GET_MY_ATTENDACE',
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT'
}

export interface AttendanceActionPending {
  type: AttendanceActionType.ATTENDANCE_ACTION_PENDING;
}

export interface AttendanceActionFailure {
  type: AttendanceActionType.ATTENDANCE_ACTION_FAILURE;
}

export interface GetAllAttendance {
  type: AttendanceActionType.GET_ALL_ATTENDANCE;
  payload: IAttendance[];
}

export interface GetMyAttendance {
  type: AttendanceActionType.GET_MY_ATTENDACE;
  payload: IAttendance[];
}

export interface Checkin {
  type: AttendanceActionType.CHECK_IN;
}

export interface Checkout {
  type: AttendanceActionType.CHECK_OUT;
}

export type AttendanceAction =
  | AttendanceActionPending
  | AttendanceActionFailure
  | GetAllAttendance
  | GetMyAttendance
  | Checkin
  | Checkout;

export type AttendanceThunkAction = ThunkAction<
  void,
  RootState,
  undefined,
  AttendanceAction
>;
