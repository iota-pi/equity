import React, { Component, ChangeEvent } from 'react';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import NumberInput from './components/NumberInput';
import HistoryDisplay from './components/HistoryDisplay';
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import Undo from '@material-ui/icons/Undo';
import ClearAll from '@material-ui/icons/ClearAll';
import { History } from './History';

const styles = (theme: Theme) => {
  const unit = theme.spacing.unit;
  return createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
    grow: {
      flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    pageContent: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    section: {
      padding: unit * 2,
      display: 'flex',
      flexDirection: 'column',
    },
    topDrawer: {
      maxHeight: '75vh',
      overflowY: 'auto',
    },
    slightPadding: {
      padding: unit,
    },
    slightMargin: {
      margin: unit,
    },
    main: {
      flexGrow: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    footer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: unit * 2,
      padding: unit * 1.5,
    },
  });
};

export interface Props extends WithStyles<typeof styles> {};
export interface State {
  history: History,
  players: number,
  names: string[],
  drawer: boolean,
  showNames: boolean,
  showCounts: boolean,
};

class App extends Component<Props, State> {
  state = {
    history: new History(1),
    players: 1,
    names: [''],
    drawer: false,
    showNames: false,
    showCounts: false,
  } as State;
  nextButton: React.RefObject<HTMLInputElement>;

  constructor (props: Props) {
    super(props);
    this.nextButton = React.createRef();
  }

  render () {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
        >
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Equity
            </Typography>

            <IconButton color="inherit" onClick={this.handleClearClick} disabled={!this.canUndo}>
              <ClearAll/>
            </IconButton>

            <IconButton color="inherit" onClick={this.handleUndoClick} disabled={!this.canUndo}>
              <Undo/>
            </IconButton>
          </Toolbar>
        </AppBar>

        <div className={classes.pageContent}>
          <div className={classes.appBarSpacer} />

          <section className={classes.section}>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <NumberInput
                  label="Number of Players"
                  variant="outlined"
                  value={this.state.players}
                  fullWidth
                  autoFocus
                  onChange={this.handlePlayerChange}
                  onEnterPress={this.handleEnterPress}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="large"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={this.handleSetNames}
                >
                  Set Names
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="large"
                  variant="outlined"
                  fullWidth
                  onClick={this.handleShowCounts}
                >
                  Individual Counts
                </Button>
              </Grid>
            </Grid>
          </section>

          <section className={[classes.section, classes.main].join(' ')}>
            <HistoryDisplay
              history={this.state.history}
              names={this.state.names}
            />
          </section>

          <Drawer
            anchor="top"
            open={this.state.drawer}
            onClose={this.handleDrawerClose}
          >
            {this.renderDrawer()}
          </Drawer>
        </div>

        <footer className={classes.footer}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={this.handleNextClick}
            buttonRef={this.nextButton}
          >
            Next
          </Button>
        </footer>
      </div>
    );
  }

  private renderDrawer = () => {
    const classes = this.props.classes;

    let drawerContent: JSX.Element = <div></div>;
    if (this.state.showNames) {
      drawerContent = (
        <div>
          {this.state.names.slice(0, this.state.players).map((name, i) => (
            <div className={classes.slightPadding} key={`playerNames-${i}`}>
              <TextField
                label={(i + 1).toString()}
                variant="outlined"
                fullWidth
                defaultValue={name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => this.handleNameChange(event, i)}
              />
            </div>
          ))}
        </div>
      )
    } else if (this.state.showCounts) {
      // Get count for each player
      const counts = this.state.history.callCounts;
      const countArray: number[] = [];
      for (let i = 0; i < this.state.players; ++i) {
        countArray.push(counts.get(i) as number);
      }
      const mostCalls = Math.max(...Array.from(counts.values()));

      drawerContent = (
        <div className={classes.slightPadding}>
          <div>
            <Grid
              container
              spacing={8}
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
          </div>


          {countArray.map((count, i) => (
            <Grid
              container
              spacing={8}
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
                  color={count < mostCalls ? "error" : "default"}
                >
                  {count}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => this.handleCallClick(i)}
                >
                  Call
                </Button>
              </Grid>
            </Grid>
          ))}
        </div>
      )
    }

    return (
      <div>
        <div className={classes.topDrawer}>
          {drawerContent}
        </div>

        <Divider/>

        <Grid container justify="center" className={classes.slightPadding}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              onClick={this.handleDrawerClose}
            >
              Done
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }

  private handlePlayerChange = (players: number) => {
    this.setState({ players, history: new History(players) });
    this.updateNames(players);
  };

  private handleNameChange = (event: ChangeEvent<HTMLInputElement>, id: number) => {
    const names = this.state.names.slice();
    names[id] = event.target.value;
    this.setState({ names });
  };

  private handleEnterPress = () => {
    if (this.nextButton.current) {
      this.nextButton.current.focus();
    }
    this.addNumber();
  };

  private get canUndo () {
    return this.state.history.numberOfCalls > 0
  }

  private handleClearClick = () => {
    const history: History = Object.create(this.state.history);
    history.clear();
    this.setState({ history });
  }

  private handleUndoClick = () => {
    const history: History = Object.create(this.state.history);
    history.undo();
    this.setState({ history });
  };

  private handleNextClick = () => {
    this.addNumber();
  };

  private handleCallClick = (player: number) => {
    this.addNumber(player);
  };

  private handleSetNames = () => {
    this.setState({ drawer: true, showNames: true });
  };

  private handleShowCounts = () => {
    this.setState({ drawer: true, showCounts: true });
  };

  private handleDrawerClose = () => {
    this.setState({ drawer: false, showNames: false, showCounts: false });
  };

  private addNumber = (player?: number) => {
    const history: History = Object.create(this.state.history);
    history.add(player);
    this.setState({ history });
  }

  private updateNames = (players: number) => {
    // Update names array, setting all missing names to null
    const names = this.state.names.slice();
    // names.length = players;
    for (let i = 0; i < players; ++i) {
      names[i] = names[i] || '';
    }
    this.setState({ names });
  }

  private playerToString = (id: number) => {
    return this.state.names[id] || (id + 1).toString()
  }
}

export default withStyles(styles)(App);
