import React, { PropsWithChildren } from 'react';
import { withStyles, WithStyles, Theme, InputAdornment, TextField, Popper } from '@material-ui/core';
import clsx from 'clsx';
import moment, { Moment } from 'moment';

import DateRangeIcon from '@material-ui/icons/DateRange';
import DateRangePopup from './DateRangePopup';

const styles = (theme: Theme) => ({
    root: {
        height: 36,
        width: 360,
        padding: 5,
        background: '#fff'
    },
    input: {
        textAlign: 'center' as 'center'
    },
    popper: {

    }
});

interface Props extends PropsWithChildren<WithStyles<typeof styles>> {
    className?: string;
    style?: React.CSSProperties;
    value?: [Moment | null, Moment | null];
    onChange?: (value: [Moment | null, Moment | null]) => void;
}

const DateRangePicker: React.SFC<Props> = (props) => {
    const {
        classes,
        children,
        className,
        value,
        onChange,
        ...other
    } = props;

    const pickerRoot = React.useRef<HTMLDivElement>(null);
    const popperRoot = React.useRef<any>(null);
    const [open, setOpen] = React.useState(false);

    const [
        from = moment(),
        to = moment()
    ] = value || [];

    const handleFocus = () => {
        setOpen(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!open) {
                return;
            }

            if (pickerRoot.current?.contains(document.activeElement)) {
                return;
            }

            if (popperRoot.current?.contains(document.activeElement)) {
                return;
            }

            setOpen(false);
        }, 0);
    };

    const handleValueChange = (value: [Moment | null, Moment | null]) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <div className={clsx(classes.root, className)} {...other} ref={pickerRoot}>
            <TextField
                value={from ? moment(from).format('L') : ''}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <DateRangeIcon />
                        </InputAdornment>
                    ),
                    readOnly: true
                }}
                inputProps={{
                    className: classes.input
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Pick a start date"
                focused={!from}
            />
            <TextField
                value={to ? moment(to).format('L') : ''}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <DateRangeIcon />
                        </InputAdornment>
                    ),
                    readOnly: true
                }}
                inputProps={{
                    className: classes.input
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Pick an end date"
                focused={!to}
            />
            <Popper open={open} anchorEl={pickerRoot.current} transition onBlur={handleBlur}>
                <div ref={popperRoot}>
                    <DateRangePopup value={[from, to]} onChange={handleValueChange} />
                </div>
            </Popper>
        </div>
    );
};

export default withStyles(styles)(DateRangePicker);