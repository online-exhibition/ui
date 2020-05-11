import { createAction } from "redux-actions";

export const THEME_LOADING = "[Theme] Loading";
export const THEME_LOADING_DONE = "[Theme] Loading done";
export const THEME_LOAD = "[Theme] Load";
export const THEME_LOAD_SUCCESS = "[Theme] Load success";
export const THEME_LOAD_FAILURE = "[Theme] Load Failure";

export const themeLoading = createAction(THEME_LOADING);
export const themeLoadingDone = createAction(THEME_LOADING_DONE);

export const themeLoad = createAction(THEME_LOAD);
export const themeLoadSuccess = createAction(THEME_LOAD_SUCCESS, (items) => ({
  items,
}));
export const themeLoadFailure = createAction(THEME_LOAD_FAILURE, (error) => ({
  error,
}));
