import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { MuiThemeProvider } from '@material-ui/core'

import App from "./App";
import theme from './theme'
import configureStore from "./store/configureStore";
import registerServiceWorker from "./registerServiceWorker";


const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
registerServiceWorker();
