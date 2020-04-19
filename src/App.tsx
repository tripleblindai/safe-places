import React from "react";
import Login from "./components/Login";
import "./scss/ui.scss";

import { Router, Route, Redirect, Switch, useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";
import PathEditor from "./components/PathEditor";
import Settings from "./components/Settings";

const history = createBrowserHistory();

function App() {
  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route path="/settings/:action?" component={Settings} />
          <Route path="/:page?/:action?" component={PathEditor} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
