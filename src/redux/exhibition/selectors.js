import {createSelector} from 'reselect';

const selectExhibition = (state) => state.exhibition;

export default {
  getItems:
    createSelector(selectExhibition, (state) => state.items),
};
