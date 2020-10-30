import React, { PropsWithChildren } from 'react';
import { withStyles, WithStyles, Theme, CssBaseline, ThemeProvider } from '@material-ui/core';
import AppTheme from '../../Theme';

const styles = (theme: Theme) => ({
    root: {
    }
});

interface Props extends PropsWithChildren<WithStyles<typeof styles>> {
    className?: string;
    style?: React.CSSProperties;
}

const Layout: React.SFC<Props> = (props) => {
    const {
        classes,
        children,
        ...other
    } = props;

    return (
        <ThemeProvider theme={AppTheme}>
                <CssBaseline />
                <div className={classes.root}>
                    {children}
                </div>
        </ThemeProvider>
    );
};

export default withStyles(styles)(Layout);