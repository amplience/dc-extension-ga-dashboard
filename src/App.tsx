import React from 'react';
import Routes from './Routes';
import { Router } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {LocalizationProvider} from '@material-ui/pickers';
import MomentUtils from '@material-ui/pickers/adapter/moment';

const browserHistory = createBrowserHistory();

function App() {
  return (
    <LocalizationProvider dateAdapter={MomentUtils}>
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </LocalizationProvider>
  );
}

export default App;
