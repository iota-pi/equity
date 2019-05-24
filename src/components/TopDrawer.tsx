import React, { Component, ChangeEvent, KeyboardEvent } from 'react'
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import AppState from '../State';

type InputChange = ChangeEvent<HTMLInputElement>;

const styles = (theme: Theme) => {
  return createStyles({
    slightPadding: {
      padding: theme.spacing(1),
    },
    slightMargin: {
      margin: theme.spacing(1),
    },
    topDrawer: {
      padding: theme.spacing(1),
      maxHeight: '75vh',
      overflowY: 'auto',
    },
  });
};
export interface Props extends WithStyles<typeof styles>, AppState {
  open: boolean,
  onClose: () => void,
  onNameChange: (name: string, number: number) => void,
  onCallClick: (player: number) => void,
  onClear: () => void,
  onClearNames: () => void,
}

class TopDrawer extends Component<Props> {
  render() {
    const classes = this.props.classes;

    let drawerContent: JSX.Element = <div></div>;
    let footerContent: JSX.Element = <div></div>;
    const doneButton = (
      <Button
        variant="outlined"
        color="primary"
        size="large"
        fullWidth
        onClick={this.props.onClose}
      >
        Done
      </Button>
    )

    if (this.props.showNames) {
      drawerContent = (
        <React.Fragment>
          {this.props.names.slice(0, this.props.players).map((name, i) => (
            <div className={classes.slightPadding} key={`playerNames-${i}`}>
              <TextField
                label={(i + 1).toString()}
                variant="outlined"
                fullWidth
                value={name}
                onChange={(event: InputChange) => this.props.onNameChange(event.target.value, i)}
                onKeyPress={this.handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="Clear field"
                      onClick={() => this.props.onNameChange('', i)}
                      tabIndex={-1}
                    >
                      <Clear/>
                    </IconButton>
                  )
                }}
              />
            </div>
          ))}
        </React.Fragment>
      )

      footerContent = (
        <React.Fragment>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={this.props.onClearNames}
            >
              Clear Names
            </Button>
          </Grid>

          <Grid item xs={6}>
            {doneButton}
          </Grid>
        </React.Fragment>
      )
    } else if (this.props.showCounts) {
      // Get count for each player
      const counts = this.props.history.callCounts;
      const countArray: number[] = [];
      for (let i = 0; i < this.props.players; ++i) {
        countArray.push(counts.get(i) as number);
      }
      const mostCalls = Math.max(...Array.from(counts.values()));

      drawerContent = (
        <React.Fragment>
          <Grid
            container
            spacing={1}
            justify="center"
            alignItems="center"
          >
            <Grid item xs={4}>
              <Typography variant="h6" align="right">
                Player
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" align="center">
                Call Count
              </Typography>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>

          <Divider className={classes.slightMargin}/>

          {countArray.map((count, i) => (
            <Grid
              container
              spacing={1}
              justify="center"
              alignItems="center"
              key={`playerCounts-${i}`}
            >
              <Grid item xs={4}>
                <Typography variant="h5" align="right">
                  {this.playerToString(i)}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  variant="body2"
                  align="center"
                  color={count < mostCalls ? "error" : "initial"}
                >
                  {count}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => this.props.onCallClick(i)}
                >
                  Call
                </Button>
              </Grid>
            </Grid>
          ))}
        </React.Fragment>
      )

      footerContent = (
        <React.Fragment>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={this.props.onClear}
            >
              Clear
            </Button>
          </Grid>

          <Grid item xs={6}>
            {doneButton}
          </Grid>
        </React.Fragment>
      )
    }

    return (
      <Drawer
        anchor="top"
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <div className={classes.topDrawer}>
          {drawerContent}
        </div>

        <Divider/>

        <div className={classes.slightPadding}>
          <Grid container justify="center" spacing={2}>
            {footerContent}
          </Grid>
        </div>
      </Drawer>
    )
  }

  private handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    // Close drawer on Ctrl-Enter
    if (event.ctrlKey && (event.nativeEvent.code === 'Enter' || event.nativeEvent.which === 13)) {
      this.props.onClose();
    }
  }

  private playerToString = (id: number) => {
    return this.props.names[id] || (id + 1).toString()
  }
}

export default withStyles(styles)(TopDrawer);
