import { handleActions } from "redux-actions";
import {
  THEME_LOADING,
  THEME_LOADING_DONE,
  THEME_LOAD_SUCCESS,
  THEME_LOAD_FAILURE,
} from "./actions";

export default handleActions(
  {
    [THEME_LOADING]: (state) => ({ ...state, loading: true }),
    [THEME_LOADING_DONE]: (state) => ({ ...state, loading: false }),
    [THEME_LOAD_SUCCESS]: (state, { payload: { items } }) => ({
      ...state,
      items,
    }),
    [THEME_LOAD_FAILURE]: (state, { payload: { error } }) => ({
      ...state,
      error,
    }),
  },
  {
    loading: false,
    items: [],
    error: null,
  }
);
