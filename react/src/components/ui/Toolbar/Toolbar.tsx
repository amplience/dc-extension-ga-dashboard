import React, { PropsWithChildren } from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';
import { DashboardContent } from '../DashboardContent';

const styles = (theme: Theme) => ({
    root: {
        width: '100%',
        background: '#8da3d0',
        padding: '6px 45px'
    },
    children: {
        padding: '0 32px'
    }
});

interface Props extends PropsWithChildren<WithStyles<typeof styles>> {
    className?: string;
    style?: React.CSSProperties;
}

const Toolbar: React.SFC<Props> = (props) => {
    const {
        classes,
        children,
        className,
        ...other
    } = props;

    return (
        <div className={clsx(classes.root, className)} {...other}>
            <DashboardContent>
                <div className={classes.children}>
                    {children}
                </div>
            </DashboardContent>
        </div>
    );
};

export default withStyles(styles)(Toolbar);