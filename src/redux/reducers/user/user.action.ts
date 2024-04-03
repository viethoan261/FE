import { AppDispatch } from '@/redux/store';
import { UserActionType, UserThunkAction } from './user.types';
import { API_URLS } from '@/configs/api/endpoint';
import { useCallApi } from '@/configs/api';
import { NotiType, renderNotification } from '@/utils/notifications';
import { ChangeProfilePayload, RegisterPayload } from '@/configs/api/payload';
import { Callback } from '@/types/others/callback';

const getAllUser = (): UserThunkAction => async (dispatch: AppDispatch) => {
  dispatch({
    type: UserActionType.USER_ACTION_PENDING
  });

  const api = API_URLS.User.getAll();

  const { response, error } = await useCallApi({ ...api });

  if (!error && response?.status === 200) {
    const { data } = response;
    dispatch({
      type: UserActionType.GET_ALL_USER_SUCCESS,
      payload: data.data
    });
  } else {
    dispatch({ type: UserActionType.USER_ACTION_FAILURE });
    renderNotification('Đã có lỗi khi lấy danh sách nhân sự', NotiType.ERROR);
  }
};

const createUser =
  (payload: RegisterPayload, cb?: Callback) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: UserActionType.USER_ACTION_PENDING
    });

    const api = API_URLS.User.create();

    const { response, error } = await useCallApi({ ...api, payload });
    if (!error && response?.status === 200) {
      dispatch({
        type: UserActionType.CREATE_USER_SUCCESS
      });
      cb?.onSuccess?.();
      renderNotification('Tạo mới nhân sự thành công', NotiType.SUCCESS);
    } else {
      dispatch({ type: UserActionType.USER_ACTION_FAILURE });
      renderNotification('Đã có lỗi khi tạo mới nhân sự', NotiType.ERROR);
    }
  };

const updateUser =
  (payload: ChangeProfilePayload, id: string | undefined, cb?: Callback) =>
  async (dispatch: AppDispatch) => {
    if (!id) return;
    dispatch({
      type: UserActionType.USER_ACTION_PENDING
    });

    const api = API_URLS.User.updateUser(id);

    const { response, error } = await useCallApi({ ...api, payload });
    if (!error && response?.status === 200) {
      dispatch({
        type: UserActionType.UPDATE_USER_SUCCESS
      });
      cb?.onSuccess?.();
      renderNotification(
        'Cập nhật thông tin nhân sự thành công',
        NotiType.SUCCESS
      );
    } else {
      dispatch({ type: UserActionType.USER_ACTION_FAILURE });
      renderNotification('Cập nhật thông tin nhân sự thất bại', NotiType.ERROR);
    }
  };

const getUserById =
  (id: string | undefined, cb?: Callback) => async (dispatch: AppDispatch) => {
    if (!id) return;
    dispatch({
      type: UserActionType.USER_ACTION_PENDING
    });

    const api = API_URLS.User.getUserById(id);

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      const { data } = response.data;

      cb?.onSuccess?.(data);
    } else {
      dispatch({ type: UserActionType.USER_ACTION_FAILURE });
      renderNotification(
        'Lấy thông tin chi tiết nhân sự thất bại',
        NotiType.ERROR
      );
    }
  };
export const UserActions = { getAllUser, createUser, updateUser, getUserById };
