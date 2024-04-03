import { Reducer } from 'redux';
import {
  AttendanceAction,
  AttendanceActionType,
  AttendanceState
} from './attendance.type';

const initialState: AttendanceState = {
  isFetching: false,
  attendances: [],
  myAttendances: []
};

export const atttendanceReducer: Reducer<AttendanceState, AttendanceAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case AttendanceActionType.ATTENDANCE_ACTION_PENDING:
      return { ...state, isFetching: true };
    case AttendanceActionType.ATTENDANCE_ACTION_FAILURE:
    case AttendanceActionType.CHECK_IN:
    case AttendanceActionType.CHECK_OUT:
      return { ...state, isFetching: false };
    case AttendanceActionType.GET_ALL_ATTENDANCE:
      return { ...state, isFetching: false, attendances: action.payload };
    case AttendanceActionType.GET_MY_ATTENDACE:
      return { ...state, isFetching: false, myAttendances: action.payload };
    default:
      return state;
  }
};
