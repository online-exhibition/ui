import {all, spawn} from 'redux-saga/effects';

import watchExhibitionActions from './exhibition/saga';

const sagas = [watchExhibitionActions];

export default function* () {
  yield all(sagas.map((saga) => spawn(saga)));
};
