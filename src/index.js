import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "redux/store";

import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import App from "./App";

import { Ajax } from "components/Ajax";
import Toaster from "components/Toaster";

import * as serviceWorker from "./serviceWorker";
import Authentication from "services/authentication/Authentication";
import ConfirmDialog from "components/ConfirmDialog";

ReactDOM.render(
  <Provider store={store}>
    <Authentication mode="basic">
      <Ajax>
        <ConfirmDialog>
          <Toaster>
            <App />
          </Toaster>
        </ConfirmDialog>
      </Ajax>
    </Authentication>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
