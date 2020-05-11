import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "redux/store";

import { de } from "date-fns/locale";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import App from "./App";

import Toaster from "components/Toaster";

import * as serviceWorker from "./serviceWorker";
import Authentication from "services/authentication/Authentication";
import ConfirmDialog from "components/ConfirmDialog";
import StatusMessages from "components/StatusMessages";

ReactDOM.render(
  <Provider store={store}>
    <Authentication mode="basic">
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={de}>
        <DndProvider backend={Backend}>
          <ConfirmDialog>
            <StatusMessages maxMessages={5}>
              <Toaster>
                <App />
              </Toaster>
            </StatusMessages>
          </ConfirmDialog>
        </DndProvider>
      </MuiPickersUtilsProvider>
    </Authentication>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
