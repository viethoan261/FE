import { Callback } from '@/types/others/callback';
import { NewsActionType, NewsThunkAction } from './news.types';
import { AppDispatch } from '@/redux/store';
import { API_URLS } from '@/configs/api/endpoint';
import { useCallApi } from '@/configs/api';
import { CreateNewsPayload } from '@/configs/api/payload';
import { NotiType, renderNotification } from '@/utils/notifications';

const getAllNews =
  (cb?: Callback): NewsThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: NewsActionType.NEWS_ACTION_PENDING
    });

    const api = API_URLS.News.getAllNews();

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({
        type: NewsActionType.GET_ALL_NEWS_SUCCESS,
        payload: response.data.data
      });
      cb?.onSuccess?.();
    } else {
      dispatch({
        type: NewsActionType.NEWS_ACTION_FAILURE
      });
    }
  };

const createNews =
  (payload: CreateNewsPayload, cb?: Callback): NewsThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: NewsActionType.NEWS_ACTION_PENDING
    });

    const api = API_URLS.News.createNews();

    const { response, error } = await useCallApi({ ...api, payload });
    if (!error && response?.status === 200) {
      dispatch({
        type: NewsActionType.CREATE_NEWS_SUCCESS
      });
      renderNotification('Tạo mới thông báo thành công', NotiType.SUCCESS);
      cb?.onSuccess?.();
    } else {
      dispatch({
        type: NewsActionType.NEWS_ACTION_FAILURE
      });
      renderNotification('Tạo mới thông báo thất bại', NotiType.ERROR);
    }
  };

const getMyNews =
  (cb?: Callback): NewsThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: NewsActionType.NEWS_ACTION_PENDING
    });

    const api = API_URLS.News.getMyNews();

    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({
        type: NewsActionType.GET_MY_NEWS_SUCCESS,
        payload: response.data.data
      });
      cb?.onSuccess?.();
    } else {
      dispatch({
        type: NewsActionType.NEWS_ACTION_FAILURE
      });
    }
  };

const getDetailsNew =
  (id: string, cb?: Callback): NewsThunkAction =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: NewsActionType.NEWS_ACTION_PENDING
    });

    const api = API_URLS.News.detailsNew(id);
    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      cb?.onSuccess?.(response.data.data);
    } else {
      dispatch({
        type: NewsActionType.NEWS_ACTION_FAILURE
      });
    }
  };

const deleteNew =
  (id: string, cb?: Callback) => async (dispatch: AppDispatch) => {
    dispatch({
      type: NewsActionType.NEWS_ACTION_PENDING
    });

    const api = API_URLS.News.deleteNew(id);
    const { response, error } = await useCallApi({ ...api });
    if (!error && response?.status === 200) {
      dispatch({
        type: NewsActionType.DELETE_NEWS_SUCCESS
      });
      cb?.onSuccess?.();
      renderNotification('Xoá thông báo thành công', NotiType.SUCCESS);
    } else {
      dispatch({
        type: NewsActionType.NEWS_ACTION_FAILURE
      });
      renderNotification('Đã có lỗi khi xoá thông báo', NotiType.ERROR);
    }
  };

const updateNew =
  (id: string, payload: CreateNewsPayload, cb?: Callback) =>
  async (dispatch: AppDispatch) => {
    dispatch({
      type: NewsActionType.NEWS_ACTION_PENDING
    });

    const api = API_URLS.News.updateNew(id);
    const { response, error } = await useCallApi({ ...api, payload });
    if (!error && response?.status === 200) {
      dispatch({
        type: NewsActionType.UPDATE_NEWS_SUCCESS
      });
      cb?.onSuccess?.();
      renderNotification('Cập nhật thông báo thành công', NotiType.SUCCESS);
    } else {
      dispatch({
        type: NewsActionType.NEWS_ACTION_FAILURE
      });
      renderNotification('Đã có lỗi khi cập nhật thông báo', NotiType.ERROR);
    }
  };

export const NewsActions = {
  getAllNews,
  getMyNews,
  createNews,
  getDetailsNew,
  deleteNew,
  updateNew
};
