import React from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';
import Layout from '../components/layout/Layout/Layout';
import { useAnalyticsApi, useAuthorize } from 'react-use-analytics-api';
import { Redirect } from 'react-router-dom';

const styles = (theme: Theme) => ({});

interface Props extends WithStyles<typeof styles> {
  className?: string;
  style?: React.CSSProperties;
}

const AuthorizePage: React.FunctionComponent<Props> = () => {
  const { ready, gapi, authorized, error } = useAnalyticsApi();

  const authorize = useAuthorize(gapi, {
    clientId:
      '909594287857-2qsfdju2pa3cis62qb52kqm869670jvr.apps.googleusercontent.com',
    container: 'authorize-container-id',
  });

  const [authorizeCalled, setAuthorizeCalled] = React.useState(false);
  const authDiv = React.useRef(null);

  React.useEffect(() => {
    if (ready && !error && !authorizeCalled) {
      authorize();
      setAuthorizeCalled(true);
    }
  }, [authorize, authorizeCalled, error, ready]);

  return (
    <Layout>
      {authorized ? <Redirect to="/dashboard" /> : null}
      <div id="authorize-container-id" ref={authDiv} />
    </Layout>
  );
};

export default withStyles(styles)(AuthorizePage);
