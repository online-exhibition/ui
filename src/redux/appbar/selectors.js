import {createSelector} from 'reselect';

const selectAppbar = (state) => state.appbar;

export default {
  show: createSelector(selectAppbar, (state) => state.show),
};
