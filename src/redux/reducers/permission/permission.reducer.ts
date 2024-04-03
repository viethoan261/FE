import { Reducer } from 'redux';
import {
  PermissionAction,
  PermissionState,
  PermissionActionType
} from './permission.type';

const initialState: PermissionState = {
  isFetching: false,
  permission: []
};

const permissionReducer: Reducer<PermissionState, PermissionAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case PermissionActionType.PERMISSION_ACTION_PENDING:
      return { ...state, isFetching: true };
    case PermissionActionType.PERMISSION_ACTION_FAILURE:
      return { ...state, isFetching: false };
    case PermissionActionType.GET_ALL_PERMISSION_SUCCESS:
      return { ...state, isFetching: false, permission: action.payload };
    default:
      return state;
  }
};

export default permissionReducer;
