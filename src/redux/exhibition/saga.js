import { call, put, takeEvery } from "redux-saga/effects";

import {
  exhibitionsLoadSuccess,
  exhibitionsLoadFailure,
  exhibitionsLoading,
  exhibitionsLoadingDone,
  EXHIBITIONS_LOAD,
} from "./actions";

function* loadExhibitions() {
  try {
    console.log("Load exhibitions");
    yield put(exhibitionsLoading());
    const response = yield call(fetch, "/api/exhibition");
    if (response.status > 399) {
      const err = response.json();
      console.error(err);
      yield put(exhibitionsLoadFailure(err));
    } else {
      yield put(exhibitionsLoadSuccess(yield response.json()));
    }
  } catch (err) {
    console.error(err);
  } finally {
    yield put(exhibitionsLoadingDone());
  }
}

export default function* watchExhibitionActions() {
  console.log("Watch exhibition");
  yield takeEvery("@APP_INIT", loadExhibitions);
  yield takeEvery(EXHIBITIONS_LOAD, loadExhibitions);
}
