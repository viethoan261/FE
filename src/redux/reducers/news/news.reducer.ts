import { Reducer } from 'redux';
import { NewsAction, NewsActionType, NewsState } from './news.types';

const initialState: NewsState = {
  isFetching: false,
  news: [],
  myNews: []
};

const newsReducer: Reducer<NewsState, NewsAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case NewsActionType.NEWS_ACTION_PENDING:
      return { ...state, isFetching: true };
    case NewsActionType.NEWS_ACTION_FAILURE:
    case NewsActionType.CREATE_NEWS_SUCCESS:
    case NewsActionType.UPDATE_NEWS_SUCCESS:
    case NewsActionType.DELETE_NEWS_SUCCESS:
      return { ...state, isFetching: false };
    case NewsActionType.GET_ALL_NEWS_SUCCESS:
      return { ...state, isFetching: false, news: action.payload };
    case NewsActionType.GET_MY_NEWS_SUCCESS:
      return { ...state, isFetching: false, myNews: action.payload };
    default:
      return state;
  }
};

export default newsReducer;
