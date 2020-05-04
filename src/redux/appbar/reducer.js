import {handleActions} from 'redux-actions';
import {SHOW_APPBAR, HIDE_APPBAR} from './actions';

export default handleActions({
  [SHOW_APPBAR]: (state) => ({...state, show: true}),
  [HIDE_APPBAR]: (state) => ({...state, show: false}),
}, {
  show: true,
});
