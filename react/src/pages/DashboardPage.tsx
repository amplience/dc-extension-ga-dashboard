import React from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';

import DashboardWidget from '../components/DashboardWidget';
import {
  DashboardState,
  DashboardStateContext,
} from '../components/DashboardState';
import TopContentWidget from '../components/TopContentWidget';
import EventsChartWidget from '../components/EventsChartWidget';
import { DateRangePicker } from '../components/ui';
import { ToolbarLayout } from '../components/layout';

const styles = (theme: Theme) => ({
  root: {
    // margin: '40px auto 0'
  },
  toolbar: {
    display: 'flex',
    color: '#fff',
    alignItems: 'center',
    fontSize: 15,
  },
  chart: {
    padding: '0 32px',
  },
  grid: {
    padding: '0 32px',
    maxWidth: 1320,
    minWidth: 1265,
    boxSizing: 'border-box' as 'border-box',
    width: '100%',
    margin: '40px auto 0',
    display: 'grid',
    gridTemplateColumns: '[left] 1fr [right] 1fr',
    gridColumnGap: 32,
  },
});

interface Props extends WithStyles<typeof styles> {
  className?: string;
  style?: React.CSSProperties;
}

const DashboardPage: React.SFC<Props> = (props) => {
  const { classes } = props;

  const dashboardState: DashboardState = {
    startDate: '28daysAgo',
    endDate: 'today',
    gaIds: 'ga:232357561',
  };

  const [dateValue, setDateValue] = React.useState<any>([]);

  return (
    <DashboardStateContext.Provider value={dashboardState}>
      <ToolbarLayout
        toolbarChildren={
          <div className={classes.toolbar}>
            Date range{' '}
            <DateRangePicker value={dateValue} onChange={setDateValue} />
          </div>
        }
      >
        <div className={classes.root}>
          {/* <Toolbar className={classes.toolbar}>
                            <DateRangePicker value={dateValue} onChange={setDateValue} />
                        </Toolbar> */}

          <div className={classes.chart}>
            <DashboardWidget title="Events Overview">
              <EventsChartWidget />
            </DashboardWidget>
          </div>
          <div className={classes.grid}>
            <DashboardWidget title="Top Content">
              <TopContentWidget />
            </DashboardWidget>
          </div>
        </div>
      </ToolbarLayout>
    </DashboardStateContext.Provider>
  );
};

export default withStyles(styles)(DashboardPage);
