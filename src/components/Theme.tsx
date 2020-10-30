import { Theme as DcTheme } from 'unofficial-dynamic-content-ui';
import { Theme } from '@material-ui/core';

export default {
    ...DcTheme,
    overrides: {
        MuiChip: {
            root: {
                backgroundColor: '#f2f2f2'
            }
        },
        MuiCssBaseline: {
            '@global': {
                body: {
                  backgroundColor: '#f2f2f2'
                }
            }
        },
        MuiPickersDesktopDateRangeCalendar: {
            rangeCalendarContainer: {
                width: '100%'
            }
        },
        MuiPickersDateRangeDay: {
            root: {
                borderRadius: '0px !important'
            },
            day: {
                borderRadius: '0px !important'
            },
            rangeIntervalDayPreview: {
                borderRadius: '0px !important'
            }
        },
        MuiPickersCalendar: {
            daysHeader: {
                backgroundColor: '#e5e5e5'
            }
        }
    }
} as Theme;