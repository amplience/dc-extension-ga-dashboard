import React, { PropsWithChildren } from 'react';
import { withStyles, WithStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

const styles = (theme: Theme) => ({
    root: {
        maxWidth: 1320,
        minWidth: 1265,
        margin: '0 auto',
        width: '100%'
    }
});

interface Props extends PropsWithChildren<WithStyles<typeof styles>> {
    className?: string;
    style?: React.CSSProperties;
}

const Content: React.SFC<Props> = (props) => {
    const {
        classes,
        children,
        className,
        ...other
    } = props;

    return (
        <section className={clsx(classes.root, className)} {...other}>
            {children}
        </section>
    );
};

export default withStyles(styles)(Content);