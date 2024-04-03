import { Reducer } from 'redux';
import { EventAction, EventState, EventActionType } from './event.type';

const initialState: EventState = {
  isFetching: false,
  events: []
};

const eventReducer: Reducer<EventState, EventAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case EventActionType.EVENT_ACTION_PENDING:
      return { ...state, isFetching: true };
    case EventActionType.EVENT_ACTION_FAILURE:
      return { ...state, isFetching: false };
    case EventActionType.GET_ALL_EVENT_SUCCESS:
      return { ...state, isFetching: false, events: action.payload };
    default:
      return state;
  }
};

export default eventReducer;
