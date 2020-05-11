import { createSelector } from "reselect";

const selectTheme = (state) => state.theme;

export default {
  getItems: createSelector(selectTheme, (state) => state.items),
};
