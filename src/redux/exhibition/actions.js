import { createAction } from "redux-actions";

export const EXHIBITIONS_LOADING = "[Exhibition] Loading";
export const EXHIBITIONS_LOADING_DONE = "[Exhibition] Loading done";
export const EXHIBITIONS_LOAD = "[Exhibition] Load";
export const EXHIBITIONS_LOAD_SUCCESS = "[Exhibition] Load success";
export const EXHIBITIONS_LOAD_FAILURE = "[Exhibition] Load Failure";

export const exhibitionsLoading = createAction(EXHIBITIONS_LOADING);
export const exhibitionsLoadingDone = createAction(EXHIBITIONS_LOADING_DONE);

export const exhibitionsLoad = createAction(EXHIBITIONS_LOAD);
export const exhibitionsLoadSuccess = createAction(
  EXHIBITIONS_LOAD_SUCCESS,
  (items) => ({ items })
);
export const exhibitionsLoadFailure = createAction(
  EXHIBITIONS_LOAD_FAILURE,
  (error) => ({ error })
);
