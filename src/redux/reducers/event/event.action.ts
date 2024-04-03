import { AppDispatch } from '@/redux/store';
import { EventActionType, EventThunkAction } from './event.type';
import { API_URLS } from '@/configs/api/endpoint';
import { useCallApi } from '@/configs/api';

const getAllEvents = (): EventThunkAction => async (dispatch: AppDispatch) => {
  dispatch({
    type: EventActionType.EVENT_ACTION_PENDING
  });

  const api = API_URLS.Events.getAllEvents();

  const { response, error } = await useCallApi({ ...api });

  if (!error && response?.status === 200) {
    dispatch({
      type: EventActionType.GET_ALL_EVENT_SUCCESS,
      payload: response.data.data
    });
  } else {
    dispatch({
      type: EventActionType.EVENT_ACTION_FAILURE
    });
  }
};

export const EventActions = { getAllEvents };
