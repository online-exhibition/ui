import {createAction} from 'redux-actions';

export const SHOW_APPBAR = '[AppBar] Show';
export const HIDE_APPBAR = '[AppBar] Hide';

export const showAppBar = createAction(SHOW_APPBAR);
export const hideAppBar = createAction(HIDE_APPBAR);
