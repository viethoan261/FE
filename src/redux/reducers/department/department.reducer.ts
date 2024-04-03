import { Reducer } from 'redux';
import {
  DepartmentAction,
  DepartmentActionType,
  DepartmentState
} from './department.type';

const initialState: DepartmentState = {
  isFetching: false,
  departments: []
};

const departmentReducer: Reducer<DepartmentState, DepartmentAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case DepartmentActionType.DEPARTMENT_ACTION_PENDING:
      return { ...state, isFetching: true };
    case DepartmentActionType.DEPARTMENT_ACTION_FAILURE:
      return { ...state, isFetching: false };
    case DepartmentActionType.GET_ALL_DEPARTMENT_SUCCESS:
      return { ...state, isFetching: false, departments: action.payload };
    case DepartmentActionType.CREATE_DEPARTMENT_SUCCESS:
    case DepartmentActionType.UPDATE_DEPARTMENT_SUCCESS:
    case DepartmentActionType.DELETE_DEPARTMENT_SUCCESS:
    case DepartmentActionType.GET_DETAILS_DEPARTMENT_SUCCESS:
    case DepartmentActionType.ADD_USER_SUCCESS:
    case DepartmentActionType.REMOVE_USER_SUCCESS:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

export default departmentReducer;
