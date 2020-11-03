import React, { PropsWithChildren } from 'react';
import { withStyles, WithStyles, Theme, Typography } from '@material-ui/core';

const styles = (theme: Theme) => ({
  root: {
    display: 'block',
    backgroundColor: '#fff',
    marginBottom: 32,
  },
  header: {
    padding: 15,
    borderBottom: '1px solid #e5e5e5',
    display: 'flex',
    justifyCcontent: 'space-between',
  },
  body: {
    padding: '0 15px 15px',
    minHeight: 350,
    boxSizing: 'border-box' as 'border-box',
    position: 'relative' as 'relative',
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  title: {
    //TODO: manage in theme
    fontWeight: 400,
    fontSize: '18px',
  },
});

interface Props extends PropsWithChildren<WithStyles<typeof styles>> {
  className?: string;
  style?: React.CSSProperties;
  title: string;
}

const DashboardWidget: React.FunctionComponent<Props> = (props) => {
  const { classes, title, children } = props;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography component="h2" variant="h6" className={classes.title}>
          {title}
        </Typography>
      </div>
      <div className={classes.body}>{children}</div>
    </div>
  );
};

export default withStyles(styles)(DashboardWidget);
