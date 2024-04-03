import { Reducer } from 'redux';
import {
  TimeoffAction,
  TimeoffActionType,
  TimeoffState
} from './timeoff.types';

const initialState: TimeoffState = {
  isFetching: false,
  allRequests: [],
  myRequests: []
};

const timeoffReducer: Reducer<TimeoffState, TimeoffAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case TimeoffActionType.TIMEOFF_ACTION_PENDING:
      return { ...state, isFetching: true };
    case TimeoffActionType.GET_ALL_REQUEST_SUCCESS:
      return { ...state, isFetching: false, allRequests: action.payload };
    case TimeoffActionType.GET_MY_REQUEST_SUCCESS:
      return { ...state, isFetching: false, myRequests: action.payload };
    case TimeoffActionType.TIMEOFF_ACTION_FAILURE:
    case TimeoffActionType.GET_BALANCE_HISTORY_SUCCESS:
    case TimeoffActionType.REQUEST_TIMEOFF_SUCCESS:
    case TimeoffActionType.CHANGE_REQUEST_STATUS:
    case TimeoffActionType.GET_MY_TIMEOFF_SUCCESS:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

export default timeoffReducer;
