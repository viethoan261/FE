import { Reducer, combineReducers } from 'redux';
import departmentReducer from './department/department.reducer';
import userReducer from './user/user.reducer';
import roleReducer from './role/role.reducer';
import permissionReducer from './permission/permission.reducer';
import timeoffReducer from './timeoff/timeoff.reducer';
import newsReducer from './news/news.reducer';
import eventReducer from './event/event.reducer';
import { atttendanceReducer } from './attendance/attendance.reducer';

const rootReducer = combineReducers({
  department: departmentReducer,
  user: userReducer,
  role: roleReducer,
  permission: permissionReducer,
  timeoff: timeoffReducer,
  news: newsReducer,
  event: eventReducer,
  attendance: atttendanceReducer
});

export type RootState = ReturnType<typeof rootReducer>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer: Reducer<RootState, any> = (
  state: RootState | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any
) => rootReducer(state, action);

export default reducer;
