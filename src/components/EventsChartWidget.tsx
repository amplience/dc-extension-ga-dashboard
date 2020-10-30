import React from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';
import { useDashboardState } from './DashboardState';
import { useAnalyticsApi, Query, useData, useDataChart } from 'react-use-analytics-api';

const styles = (theme: Theme) => ({
    chart: {
        width: '100%',
    }
});

interface Props extends WithStyles<typeof styles> {
    className?: string;
    style?: React.CSSProperties;
}

const EventsChartWidget: React.SFC<Props> = (props) => {
    const {
        classes,
        ...other
    } = props;

    const {
        gaIds = '',
        endDate = 'today',
        startDate = '7daysAgo'
    } = useDashboardState() || {};

    const { ready, gapi, authorized, error } = useAnalyticsApi();
    const [rows, setRows] = React.useState([]);

    const query: Query = {
        metrics: 'ga:totalEvents,ga:uniqueEvents',
        dimensions: 'ga:date',
        'start-date': startDate,
        'end-date': endDate,
        ids: gaIds
    };
    const chart = {
        container: 'data-chart-container',
        type: 'LINE',
        options: {
            title: 'Events',
            width: '100%'
        },
    };

    useDataChart(gapi, query, chart);

    return (
        <div>
            <div className={classes.chart} id="data-chart-container" />
        </div>
    );
};

export default withStyles(styles)(EventsChartWidget);