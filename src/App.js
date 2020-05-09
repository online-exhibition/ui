import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

import Navigation from "narratives/Navigation";

import Home from "narratives/public/Home";

import Register from "narratives/user/Register";
import Confirm from "narratives/user/Confirm";
import Login from "narratives/user/Login";

import Upload from "narratives/upload/Upload";

import Images from "narratives/management/Images";
import Exhibition from "narratives/exhibition/Exhibition";
import Exhibitions from "narratives/exhibition/Exhibitions";
import EditImage from "narratives/management/EditImage";
import ManagementExhibitions from "narratives/management/Exhibitions";
import EditExhibtion from "narratives/management/EditExhibtion";
import ExhibitionPlayer from "narratives/exhibition/ExhibitionPlayer";

const THEME = createMuiTheme({
  typography: {
    fontFamily: '"Roboto", "Oswald", "Helvetica", "Arial", sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

/**
 * Exhibition app entry point
 * @return {object} root DOM representation of the app
 */
function App() {
  return (
    <MuiThemeProvider theme={THEME}>
      <Router>
        <Navigation />
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/confirm" component={Confirm} />
          <Route path="/login" component={Login} />
          <Route path="/upload" component={Upload} />
          <Route path="/exhibition/:id" component={ExhibitionPlayer} />
          <Route path="/exhibition" component={Exhibitions} />
          <Route path="/management/images/:id" component={EditImage} />
          <Route path="/management/images" component={Images} />
          <Route path="/management/exhibition/:id" component={EditExhibtion} />
          <Route
            path="/management/exhibition"
            component={ManagementExhibitions}
          />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
