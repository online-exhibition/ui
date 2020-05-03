import {handleActions} from 'redux-actions';
import {
  EXHIBITIONS_LOADING,
  EXHIBITIONS_LOADING_DONE,
  EXHIBITIONS_LOAD_SUCCESS,
  EXHIBITIONS_LOAD_FAILURE,
} from './actions';

export default handleActions({
  [EXHIBITIONS_LOADING]: (state) => ({...state, loading: true}),
  [EXHIBITIONS_LOADING_DONE]: (state) => ({...state, loading: false}),
  [EXHIBITIONS_LOAD_SUCCESS]:
    (state, {payload: {items}}) => ({...state, items}),
  [EXHIBITIONS_LOAD_FAILURE]:
    (state, {payload: {error}}) => ({...state, error}),
}, {
  loading: false,
  items: [],
  error: null,
});
