import { all, spawn } from "redux-saga/effects";

import watchExhibitionActions from "./exhibition/saga";
import watchThemeActions from "./theme/saga";

const sagas = [watchExhibitionActions, watchThemeActions];

export default function* () {
  yield all(sagas.map((saga) => spawn(saga)));
}
