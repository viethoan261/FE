import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';
import { IEvent } from '@/types/models/IEvent';

export interface EventState {
  isFetching: boolean;
  events: IEvent[];
}

export enum EventActionType {
  EVENT_ACTION_PENDING = 'EVENT_ACTION_PENDING',
  EVENT_ACTION_FAILURE = 'EVENT_ACTION_FAILURE',
  GET_ALL_EVENT_SUCCESS = 'GET_ALL_EVENT_SUCCESS'
}

export interface EventActionPending {
  type: EventActionType.EVENT_ACTION_PENDING;
}

export interface EventActionFailure {
  type: EventActionType.EVENT_ACTION_FAILURE;
}

export interface GetAllEventSuccess {
  type: EventActionType.GET_ALL_EVENT_SUCCESS;
  payload: IEvent[];
}

export type EventAction =
  | EventActionPending
  | EventActionFailure
  | GetAllEventSuccess;

export type EventThunkAction = ThunkAction<
  void,
  RootState,
  unknown,
  EventAction
>;
