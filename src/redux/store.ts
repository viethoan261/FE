import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, Store } from 'redux';
import { TypedUseSelectorHook } from 'react-redux';
import reducer, { RootState } from './reducers';

const logger = createLogger({
  collapsed: true,
  colors: {
    title: () => '#139BFE',
    prevState: () => '#1C5FAF',
    action: () => '#149945',
    nextState: () => '#A47104',
    error: () => '#ff0005'
  },
  titleFormatter: (action) => `ACTION: ${action.type}`
});

const middlewares = composeWithDevTools(applyMiddleware(thunk, logger));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store: Store<RootState, any> = createStore(reducer, middlewares);

export type AppDispatch = typeof store.dispatch;

export type AppSelector = ReturnType<TypedUseSelectorHook<RootState>>;

export default store;
