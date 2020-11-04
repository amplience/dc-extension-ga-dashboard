import React from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';
import { useDashboardState } from './DashboardState';
import { useAnalyticsApi, Query, useData } from 'react-use-analytics-api';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = (theme: Theme) => ({
  table: {
    width: '100%',
  },
});

interface Props extends WithStyles<typeof styles> {
  className?: string;
  style?: React.CSSProperties;
}

const TopContentWidget: React.SFC<Props> = (props) => {
  const { classes } = props;

  const { gaIds = '', endDate = 'today', startDate = '7daysAgo' } =
    useDashboardState() || {};

  const { gapi } = useAnalyticsApi();
  const [rows, setRows] = React.useState([]);

  const query: Query = {
    metrics: 'ga:totalEvents,ga:uniqueEvents,ga:eventValue',
    dimensions: 'ga:dimension1',
    sort: 'ga:totalEvents',
    'max-results': 10,
    'start-date': startDate,
    'end-date': endDate,
    ids: gaIds,
  };
  const execute = useData(
    gapi,
    query,
    (response) => {
      console.log('Data query response:', response);
      setRows(response.rows);
    },
    (response) => console.error('Data query error:', response)
  );

  React.useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Content Item Id</TableCell>
              <TableCell align="right">Events</TableCell>
              <TableCell align="right">Unique Events</TableCell>
              <TableCell align="right">Event Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row[0]}
                </TableCell>
                <TableCell align="right">{row[1]}</TableCell>
                <TableCell align="right">{row[2]}</TableCell>
                <TableCell align="right">{row[3]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default withStyles(styles)(TopContentWidget);
