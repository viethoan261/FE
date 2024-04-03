import { AppDispatch } from '@/redux/store';
import { PermissionThunkAction, PermissionActionType } from './permission.type';
import { API_URLS } from '@/configs/api/endpoint';
import { useCallApi } from '@/configs/api';
import { NotiType, renderNotification } from '@/utils/notifications';

const getAllPermission =
  (): PermissionThunkAction => async (dispatch: AppDispatch) => {
    dispatch({
      type: PermissionActionType.PERMISSION_ACTION_PENDING
    });

    const api = API_URLS.Permission.getAll();

    const { response, error } = await useCallApi({ ...api });

    if (!error && response?.status === 200) {
      const { data } = response;

      dispatch({
        type: PermissionActionType.GET_ALL_PERMISSION_SUCCESS,
        payload: data.data
      });
    } else {
      dispatch({ type: PermissionActionType.PERMISSION_ACTION_FAILURE });
      renderNotification('Đã có lỗi khi lấy danh sách quyền', NotiType.ERROR);
    }
  };

export const PermissionActions = { getAllPermission };
