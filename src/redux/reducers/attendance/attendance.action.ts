import { AppDispatch } from '@/redux/store';
import { AttendanceActionType, AttendanceThunkAction } from './attendance.type';
import { API_URLS } from '@/configs/api/endpoint';
import { useCallApi } from '@/configs/api';
import { NotiType, renderNotification } from '@/utils/notifications';
import { Callback } from '@/types/others/callback';

const checkin = (): AttendanceThunkAction => async (dispatch: AppDispatch) => {
  dispatch({
    type: AttendanceActionType.ATTENDANCE_ACTION_PENDING
  });

  const api = API_URLS.Attendance.checkin();

  const { response, error } = await useCallApi({ ...api });
  if (!error && response?.status === 200) {
    dispatch({
      type: AttendanceActionType.CHECK_IN
    });
  } else {
    dispatch({
      type: AttendanceActionType.ATTENDANCE_ACTION_FAILURE
    });
    renderNotification('Đã có lỗi xảy ra', NotiType.ERROR);
  }
};

const checkout =
  (note: string): AttendanceThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: AttendanceActionType.ATTENDANCE_ACTION_PENDING
    });

    const api = API_URLS.Attendance.checkout(note);

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({
        type: AttendanceActionType.CHECK_OUT
      });
    } else {
      dispatch({
        type: AttendanceActionType.ATTENDANCE_ACTION_FAILURE
      });
      renderNotification('Đã có lỗi xảy ra', NotiType.ERROR);
    }
  };

const getAllAttendances =
  (cb?: Callback): AttendanceThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: AttendanceActionType.ATTENDANCE_ACTION_PENDING
    });

    const api = API_URLS.Attendance.getAllAttendances();

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({
        type: AttendanceActionType.GET_ALL_ATTENDANCE,
        payload: response.data.data
      });
      cb?.onSuccess?.(response.data.data);
    } else {
      dispatch({
        type: AttendanceActionType.ATTENDANCE_ACTION_FAILURE
      });
      renderNotification('Đã có lỗi xảy ra', NotiType.ERROR);
    }
  };

const getMyAttendances =
  (cb?: Callback): AttendanceThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: AttendanceActionType.ATTENDANCE_ACTION_PENDING
    });

    const api = API_URLS.Attendance.getMyAttendances();

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({
        type: AttendanceActionType.GET_MY_ATTENDACE,
        payload: response.data.data
      });
      cb?.onSuccess?.(response.data.data);
    } else {
      dispatch({
        type: AttendanceActionType.ATTENDANCE_ACTION_FAILURE
      });
      renderNotification('Đã có lỗi xảy ra', NotiType.ERROR);
    }
  };

export const AttendanceAction = {
  checkin,
  checkout,
  getAllAttendances,
  getMyAttendances
};
