import { call, put, takeEvery } from "redux-saga/effects";

import {
  themeLoadSuccess,
  themeLoadFailure,
  themeLoading,
  themeLoadingDone,
  THEME_LOAD,
} from "./actions";

function* loadThemes() {
  try {
    yield put(themeLoading());
    const response = yield call(fetch, "/api/theme");
    if (response.status > 399) {
      const err = response.json();
      console.error(err);
      yield put(themeLoadFailure(err));
    } else {
      yield put(themeLoadSuccess(yield response.json()));
    }
  } catch (err) {
    console.error(err);
  } finally {
    yield put(themeLoadingDone());
  }
}

export default function* watchThemeActions() {
  yield takeEvery("@APP_INIT", loadThemes);
  yield takeEvery(THEME_LOAD, loadThemes);
}
