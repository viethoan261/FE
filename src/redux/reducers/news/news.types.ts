import { INew } from '@/types/models/INew';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';

export interface NewsState {
  isFetching: boolean;
  news: INew[];
  myNews: INew[];
}

export enum NewsActionType {
  NEWS_ACTION_PENDING = 'NEWS_ACTION_PENDING',
  NEWS_ACTION_FAILURE = 'NEWS_ACTION_FAILURE',

  GET_ALL_NEWS_SUCCESS = 'GET_ALL_NEWS_ACTION_SUCCESS',
  GET_MY_NEWS_SUCCESS = 'GET_MY_NEWS_SUCCESS',
  CREATE_NEWS_SUCCESS = 'CREATE_NEWS_SUCCESS',
  UPDATE_NEWS_SUCCESS = 'UPDATE_NEWS_SUCCESS',
  DELETE_NEWS_SUCCESS = 'DELETE_NEWS_SUCCESS'
}

export interface NewsActionPending {
  type: NewsActionType.NEWS_ACTION_PENDING;
}
export interface NewsActionFailure {
  type: NewsActionType.NEWS_ACTION_FAILURE;
}
export interface GetAllNewsSuccess {
  type: NewsActionType.GET_ALL_NEWS_SUCCESS;
  payload: INew[];
}
export interface GetMyNewsSuccess {
  type: NewsActionType.GET_MY_NEWS_SUCCESS;
  payload: INew[];
}
export interface CreateNewsSuccess {
  type: NewsActionType.CREATE_NEWS_SUCCESS;
}
export interface UpdateNewsSuccess {
  type: NewsActionType.UPDATE_NEWS_SUCCESS;
}
export interface DeleteNewsSuccess {
  type: NewsActionType.DELETE_NEWS_SUCCESS;
}

export type NewsAction =
  | NewsActionPending
  | NewsActionFailure
  | GetAllNewsSuccess
  | GetMyNewsSuccess
  | CreateNewsSuccess
  | UpdateNewsSuccess
  | DeleteNewsSuccess;

export type NewsThunkAction = ThunkAction<
  void,
  RootState,
  undefined,
  NewsAction
>;
