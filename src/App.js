import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Navigation from 'narratives/Navigation';

import Home from 'narratives/public/Home';

import Register from 'narratives/user/Register';
import Confirm from 'narratives/user/Confirm';
import Login from 'narratives/user/Login';

import Upload from 'narratives/upload/Upload';

import Images from 'narratives/management/Images';


/**
 * Exhibition app entry point
 * @return {object} root DOM representation of the app
 */
function App() {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/confirm" component={Confirm} />
        <Route path="/login" component={Login} />
        <Route path="/upload" component={Upload} />
        <Route path="/images" component={Images} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
