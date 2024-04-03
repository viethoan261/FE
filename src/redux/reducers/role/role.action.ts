import { useCallApi } from '@/configs/api';
import { API_URLS } from '@/configs/api/endpoint';
import {
  AssignRolePermissionPayload,
  CreateRolePayload,
  UpdateRolePayload
} from '@/configs/api/payload';
import { AppDispatch } from '@/redux/store';
import { Callback } from '@/types/others/callback';
import { NotiType, renderNotification } from '@/utils/notifications';
import { RoleActionType, RoleThunkAction } from './role.types';

const getAllRole = (): RoleThunkAction => async (dispatch: AppDispatch) => {
  dispatch({ type: RoleActionType.ROLE_ACTION_PENDING });

  const api = API_URLS.Role.getAll();

  const { response, error } = await useCallApi({ ...api });
  if (!error && response?.status === 200) {
    const { data } = response;
    dispatch({
      type: RoleActionType.GET_ALL_ROLE_SUCCESS,
      payload: data.data
    });
  } else {
    dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
    renderNotification('Đã có lỗi khi lấy danh sách vai trò', NotiType.ERROR);
  }
};

const toggleStatus =
  (id: string, cb?: Callback): RoleThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: RoleActionType.ROLE_ACTION_PENDING });

    const api = API_URLS.Role.toggle(id);

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({
        type: RoleActionType.TOGGLE_ROLE_SUCCESS
      });
      cb?.onSuccess?.();
      renderNotification('Thay đổi trạng thái thành công', NotiType.SUCCESS);
    } else {
      dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
      renderNotification(
        'Đã có lỗi khi thay đổi trạng thái vai trò',
        NotiType.ERROR
      );
    }
  };

const deleteStatus =
  (id: string, cb?: Callback): RoleThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: RoleActionType.ROLE_ACTION_PENDING });

    const api = API_URLS.Role.delete(id);

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({
        type: RoleActionType.DELETE_ROLE_SUCCESS
      });
      cb?.onSuccess?.();
      renderNotification('Xoá thành công', NotiType.SUCCESS);
    } else {
      dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
      renderNotification('Đã có lỗi khi xoá vai trò', NotiType.ERROR);
    }
  };

const createRole =
  (payload: CreateRolePayload, cb?: Callback): RoleThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: RoleActionType.ROLE_ACTION_PENDING
    });

    const api = API_URLS.Role.create();

    const { response, error } = await useCallApi({ ...api, payload });

    if (!error && response?.status === 200) {
      dispatch({
        type: RoleActionType.CREATE_ROLE_SUCCESS
      });
      cb?.onSuccess?.();
      renderNotification('Tạo vai trò thành công', NotiType.SUCCESS);
    } else {
      dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
      renderNotification('Đã có lỗi khi tạo vai trò', NotiType.ERROR);
    }
  };

const updateRole =
  (
    payload: UpdateRolePayload,
    id: string | undefined,
    cb?: Callback
  ): RoleThunkAction =>
  async (dispatch: AppDispatch) => {
    if (!id) return;

    dispatch({
      type: RoleActionType.ROLE_ACTION_PENDING
    });

    const api = API_URLS.Role.update(id);

    const { response, error } = await useCallApi({ ...api, payload });

    if (!error && response?.status === 200) {
      dispatch({
        type: RoleActionType.UPDATE_ROLE_SUCCESS
      });
      cb?.onSuccess?.();
      cb?.onError?.();
      renderNotification('Cập nhật vai trò thành công', NotiType.SUCCESS);
    } else {
      dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
      renderNotification('Đã có lỗi khi cập nhật vai trò', NotiType.ERROR);
    }
  };

const assignPermission =
  (
    payload: AssignRolePermissionPayload,
    id: string | undefined,
    cb?: Callback
  ): RoleThunkAction =>
  async (dispatch: AppDispatch) => {
    if (!id) return;

    dispatch({
      type: RoleActionType.ROLE_ACTION_PENDING
    });

    const api = API_URLS.Role.assignPermission(id);

    const { response, error } = await useCallApi({ ...api, payload });

    if (!error && response?.status === 200) {
      dispatch({
        type: RoleActionType.ASSIGN_PERMISSION_SUCCESS
      });
      cb?.onSuccess?.();
      renderNotification(
        'Cập nhật quyền cho vai trò thành công',
        NotiType.SUCCESS
      );
    } else {
      dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
      renderNotification(
        'Đã có lỗi khi cập nhật quyền cho vai trò',
        NotiType.ERROR
      );
    }
  };

const getDetailsRole =
  (id: string | undefined, cb?: Callback): RoleThunkAction =>
  async (dispatch: AppDispatch) => {
    if (!id) return;
    dispatch({ type: RoleActionType.ROLE_ACTION_PENDING });

    const api = API_URLS.Role.getDetails(id);

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({ type: RoleActionType.GET_DETAILS_ROLE_SUCCESS });
      cb?.onSuccess?.(response.data.data);
    } else {
      dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
      renderNotification(
        'Lấy thông tin chi tiết vai trò thất bại',
        NotiType.ERROR
      );
    }
  };

const addUser =
  (id: string | undefined, payload: string[], cb?: Callback): RoleThunkAction =>
  async (dispatch: AppDispatch) => {
    if (!id) return;
    dispatch({ type: RoleActionType.ROLE_ACTION_PENDING });

    const api = API_URLS.Role.addUser(id);

    const { response, error } = await useCallApi({ ...api, payload });
    if (!error && response?.status === 200) {
      dispatch({ type: RoleActionType.ADD_USER_SUCCESS });
      renderNotification(
        'Thêm nhân sự theo vai trò thành công',
        NotiType.SUCCESS
      );
      cb?.onSuccess?.();
    } else {
      dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
      renderNotification('Thêm nhân sự vào phòng ban thất bại', NotiType.ERROR);
    }
  };

const removeUser =
  (
    userId: string | undefined,
    roleId: string | undefined,
    cb?: Callback
  ): RoleThunkAction =>
  async (dispatch: AppDispatch) => {
    if (!userId || !roleId) return;
    dispatch({ type: RoleActionType.ROLE_ACTION_PENDING });

    const api = API_URLS.Role.removeUser(roleId, userId);

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({ type: RoleActionType.REMOVE_USER_SUCCESS });
      renderNotification(
        'Xoá nhân sự khỏi vai trò thành công',
        NotiType.SUCCESS
      );
      cb?.onSuccess?.();
    } else {
      dispatch({ type: RoleActionType.ROLE_ACTION_FAILURE });
      renderNotification('Xoá nhân sự khỏi vai trò thất bại', NotiType.ERROR);
    }
  };
export const RoleActions = {
  getAllRole,
  toggleStatus,
  deleteStatus,
  createRole,
  updateRole,
  assignPermission,
  removeUser,
  addUser,
  getDetailsRole
};
