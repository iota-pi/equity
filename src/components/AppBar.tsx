import React, { PureComponent } from 'react';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Undo from '@material-ui/icons/Undo';
import ClearAll from '@material-ui/icons/ClearAll';

const styles = (theme: Theme) => {
  return createStyles({
    grow: {
      flexGrow: 1,
    },
  });
};

export interface Props extends WithStyles<typeof styles> {
  onClear: () => void,
  onUndo: () => void,
  canUndo: boolean,
};

class EquityAppBar extends PureComponent<Props> {
  render() {
    const { classes } = this.props;
    return (
      <AppBar
        position="absolute"
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Equity
          </Typography>

          <IconButton
            color="inherit"
            onClick={this.props.onClear}
            disabled={!this.props.canUndo}
            aria-label="Clear"
          >
            <ClearAll/>
          </IconButton>

          <IconButton
            color="inherit"
            onClick={this.props.onUndo}
            disabled={!this.props.canUndo}
            aria-label="Undo"
          >
            <Undo/>
          </IconButton>
        </Toolbar>
      </AppBar>
    )
  }
};

export default withStyles(styles)(EquityAppBar);
