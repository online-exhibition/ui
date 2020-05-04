import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from 'redux/store';

import './index.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import App from './App';

import {Ajax} from 'components/Ajax';
import Toaster from 'components/Toaster';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={store}>
      <Ajax>
        <Toaster>
          <App />
        </Toaster>
      </Ajax>
    </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
