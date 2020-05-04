import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import appbarReducer from 'redux/appbar/reducer';
import exhibitionReducer from 'redux/exhibition/reducer';

import sagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    appbar: appbarReducer,
    exhibition: exhibitionReducer,
  },
  middleware: [
    sagaMiddleware,
  ],
});

sagaMiddleware.run(sagas);
store.dispatch({type: '@APP_INIT'});

export default store;
