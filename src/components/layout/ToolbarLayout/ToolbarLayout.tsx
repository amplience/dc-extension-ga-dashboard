import React, { PropsWithChildren, ReactNode } from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';
import { Layout } from '../Layout';
import { Toolbar, DashboardContent } from '../../ui';

const styles = (theme: Theme) => ({
  root: {},
  toolbarSection: {
    top: 0,
    position: 'sticky' as 'sticky',
    zIndex: 2,
  },
  toolbar: {
    height: 48,
  },
  contentSection: {
    overflowY: 'auto' as 'auto',
    height: 'calc(100% - 48px)',
    margin: '40px auto 0',
  },
});

interface Props extends PropsWithChildren<WithStyles<typeof styles>> {
  className?: string;
  style?: React.CSSProperties;
  toolbarChildren?: ReactNode;
}

const DashboardLayout: React.FunctionComponent<Props> = (props) => {
  const { classes, children, toolbarChildren } = props;

  return (
    <Layout>
      <section className={classes.toolbarSection}>
        <Toolbar className={classes.toolbar}>
          <DashboardContent>{toolbarChildren}</DashboardContent>
          {/* <DateRangePicker value={dateValue} onChange={setDateValue} /> */}
        </Toolbar>
      </section>
      <section className={classes.contentSection}>
        <DashboardContent>{children}</DashboardContent>
      </section>
    </Layout>
  );
};

export default withStyles(styles)(DashboardLayout);
