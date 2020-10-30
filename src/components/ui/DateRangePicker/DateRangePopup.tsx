import React from 'react';
import { withStyles, WithStyles, Theme, TextField, Chip } from '@material-ui/core';
import { StaticDateRangePicker, DateRangeDelimiter } from "@material-ui/pickers";
import moment, { Moment } from 'moment';

const styles = (theme: Theme) => ({
    root: {
        width: 360,
        padding: 5,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column' as 'column',
        boxShadow: '0 3px 13px rgba(0,0,0,.08)'
    },
    chips: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 18,
        paddingBottom: 18,
        borderBottom: '1px solid #eee'
    },
    chip: {
        marginRight: 12
    },
    calendar: {
        width: '100%'
    }
});

interface Props extends WithStyles<typeof styles> {
    className?: string;
    style?: React.CSSProperties;
    value: [Moment | null, Moment | null];
    onChange: (value: [Moment | null, Moment | null]) => void;
}

const DateRangePopup: React.SFC<Props> = (props) => {
    const {
        classes,
        value,
        onChange,
        ...other
    } = props;

    const [selectedChip, setSelectedChip] = React.useState<string | null>(null);

    const handleSelectChip = (value: string) => {
        setSelectedChip(value);

        switch(value) {
            case 'today':
                onChange([moment(), moment()]);
                break;
            case 'yesterday':
                onChange([moment().subtract(1, 'd'), moment().subtract(1, 'd')]);
                break;
            case 'lastweek':
                onChange([
                    moment().subtract(1, 'weeks').startOf('week'),
                    moment().subtract(1, 'weeks').endOf('week')
                ]);
                break;
            case 'last30days':
                onChange([moment().subtract(30, 'd'), moment().subtract(1, 'd')]);
                break;
        }
    }

    const handleDateChange = (value: any) => {
        setSelectedChip(null);
        onChange(value);
    }

    return (
        <div className={classes.root}>
            <div className={classes.chips}>
                <Chip
                    size="small"
                    label="Last 30 days"
                    onClick={() => handleSelectChip('last30days')}
                    color={selectedChip === 'last30days' ? 'primary' : 'default'}
                    className={classes.chip}
                />
                <Chip
                    size="small"
                    label="Last week"
                    onClick={() => handleSelectChip('lastweek')}
                    color={selectedChip === 'lastweek' ? 'primary' : 'default'}
                    className={classes.chip}
                />
                <Chip
                    size="small"
                    label="Yesterday"
                    onClick={() => handleSelectChip('yesterday')}
                    color={selectedChip === 'yesterday' ? 'primary' : 'default'}
                    className={classes.chip}
                />
                <Chip
                    size="small"
                    label="Today"
                    onClick={() => handleSelectChip('today')}
                    color={selectedChip === 'today' ? 'primary' : 'default'}
                    className={classes.chip}
                />
            </div>
            <StaticDateRangePicker
                maxDate={moment()}
                displayStaticWrapperAs="desktop"
                value={value}
                onChange={handleDateChange}
                calendars={1}
                renderInput={(startProps, endProps) => (
                    <React.Fragment>
                        <TextField {...startProps} />
                            <DateRangeDelimiter> to </DateRangeDelimiter>
                        <TextField {...endProps} />
                    </React.Fragment>
                )}
                className={classes.calendar}
                {...other}
            />
        </div>
    );
};

export default withStyles(styles)(DateRangePopup);