import React from 'react';
import { RouteProps, Route, Redirect } from 'react-router-dom';
import { useAnalyticsApi } from 'react-use-analytics-api';

export function AuthorizedRoute(props: RouteProps) {
  const { component: Component, ...other } = props;

  const { authorized } = useAnalyticsApi();
  const TypedComponent = Component as any;

  return (
    <Route
      {...other}
      render={(props) => {
        if (!authorized) {
          return (
            <Redirect
              to={{ pathname: '/authorize', state: { from: props.location } }}
            />
          );
        } else {
          return <TypedComponent {...props} />;
        }
      }}
    />
  );
}
