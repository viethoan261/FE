import { Reducer } from 'redux';
import { UserAction, UserActionType, UserState } from './user.types';

const initialState: UserState = {
  isFetching: false,
  users: []
};
const userReducer: Reducer<UserState, UserAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UserActionType.USER_ACTION_PENDING:
      return { ...state, isFetching: true };
    case UserActionType.USER_ACTION_FAILURE:
    case UserActionType.CREATE_USER_SUCCESS:
    case UserActionType.UPDATE_USER_SUCCESS:
    case UserActionType.DELETE_USER_SUCCESS:
      return { ...state, isFetching: false };
    case UserActionType.GET_ALL_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        users: action.payload
      };
    default:
      return state;
  }
};

export default userReducer;
