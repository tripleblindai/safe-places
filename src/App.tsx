import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./components/Login";
import "./scss/ui.scss";

import { Router, Route, Redirect, Switch, useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";
import PathEditor from "./components/PathEditor";

const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={PathEditor} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
