import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import AuthorizePage from './pages/AuthorizePage';
import DashboardPage from './pages/DashboardPage';
import { AuthorizedRoute } from './components/AuthorizedRoute';



const Routes = () => {
    return (
      <Switch>
        <AuthorizedRoute exact path="/dashboard" component={DashboardPage} />
        <Route exact path="/authorize" component={AuthorizePage} />
        <Redirect from="/" to="/dashboard" />
        <Redirect to="/not-found" />
      </Switch>
    );
  };
  
  export default Routes;