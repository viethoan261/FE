import { Reducer } from 'redux';
import { RoleAction, RoleActionType, RoleState } from './role.types';

const initialState: RoleState = {
  isFetching: false,
  roles: []
};

const roleReducer: Reducer<RoleState, RoleAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case RoleActionType.ROLE_ACTION_PENDING:
      return { ...state, isFetching: true };
    case RoleActionType.ROLE_ACTION_FAILURE:
    case RoleActionType.DELETE_ROLE_SUCCESS:
    case RoleActionType.ASSIGN_PERMISSION_SUCCESS:
    case RoleActionType.CREATE_ROLE_SUCCESS:
    case RoleActionType.UPDATE_ROLE_SUCCESS:
    case RoleActionType.TOGGLE_ROLE_SUCCESS:
    case RoleActionType.ADD_USER_SUCCESS:
    case RoleActionType.GET_DETAILS_ROLE_SUCCESS:
    case RoleActionType.REMOVE_USER_SUCCESS:
      return { ...state, isFetching: false };
    case RoleActionType.GET_ALL_ROLE_SUCCESS:
      return { ...state, isFetching: false, roles: action.payload };
    default:
      return state;
  }
};

export default roleReducer;
