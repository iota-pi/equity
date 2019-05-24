import React, { Component, ChangeEvent } from 'react';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import createMuiTheme, { Theme } from "@material-ui/core/styles/createMuiTheme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import NumberInput from './components/NumberInput';
import HistoryDisplay from './components/HistoryDisplay';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';
import Undo from '@material-ui/icons/Undo';
import Close from '@material-ui/icons/Close';
import ClearAll from '@material-ui/icons/ClearAll';
import amber from '@material-ui/core/colors/amber';

import * as serviceWorker from './serviceWorker';
import TopDrawer from './components/TopDrawer';
import { PlayerHistory } from './History';
import State from './State';

const theme = createMuiTheme({
  palette: {
    primary: amber,
    secondary: {
      main: '#2979ff',
    },
  },
  typography: {},
});

const styles = (theme: Theme) => {
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
      paddingTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    section: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    moreTopPadding: {
      paddingTop: theme.spacing(2),
    },
    main: {
      flexGrow: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    footer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
      padding: theme.spacing(1.5),
    },
  });
};

export interface Props extends WithStyles<typeof styles> {};

const defaults = {
  players: 1,
  names: [''],
};

class App extends Component<Props, State> {
  state: State = {
    players: 1,
    history: new PlayerHistory(1),
    names: [''],
    dontConfirmClear: 0,
    dialog: false,
    drawer: false,
    showNames: false,
    showCounts: false,
    updateSW: false,
  };

  nextButton: React.RefObject<HTMLInputElement>;

  constructor (props: Props) {
    super(props);
    this.nextButton = React.createRef();
  }

  render () {
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="absolute"
          >
            <Toolbar>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Equity
              </Typography>

              <IconButton color="inherit" onClick={this.handleDialogOpen} disabled={!this.canUndo}>
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
              <Grid container spacing={2}>
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
                    View Counts
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

            <TopDrawer
              open={this.state.drawer}
              onClose={this.handleDrawerClose}
              onNameChange={this.handleNameChange}
              onCallClick={this.handleCallClick}
              onClear={this.handleClearClick}
              onClearNames={this.handleClearNames}
              {...this.state}
            />

            <Dialog
              open={this.state.dialog}
              onClose={this.handleDialogClose}
              aria-labelledby="alert-dialog-title"
            >
              <DialogContent className={classes.moreTopPadding}>
                <Typography>
                  Clear player call history? This cannot be undone.
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.dontConfirmClear >= Date.now()}
                      onChange={this.handleChangeCheck}
                      color="primary"
                    />
                  }
                  label="Don't ask again today"
                />
              </DialogContent>

              <DialogActions>
                <Button variant="text" onClick={this.handleDialogClose}>
                  Cancel
                </Button>
                <Button variant="outlined" onClick={this.handleClearClick}>
                  Clear
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={this.state.updateSW}
              onClose={this.handleSnackDismiss}
              message="This app has been updated since you last visited"
              action={[
                <Button
                  key="update"
                  color="primary"
                  size="small"
                  variant="text"
                  onClick={this.handleUpdateSW}
                >
                  Refresh
                </Button>,
                <IconButton
                  key="close"
                  color="inherit"
                  onClick={this.handleSnackDismiss}
                >
                  <Close/>
                </IconButton>
              ]}
            />
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
      </ThemeProvider>
    );
  }

  componentWillMount () {
    this.setState({ ...this.loadFromStorage() });
  }

  componentDidMount () {
    const app = this;
    serviceWorker.register({
      onUpdate () {
        app.setState({ updateSW: true });
      }
    });
  }

  componentDidUpdate (_: Props, prevState: State) {
    if (prevState.history !== this.state.history ||
        prevState.names !== this.state.names ||
        prevState.players !== this.state.players ||
        prevState.dontConfirmClear !== this.state.dontConfirmClear) {
      this.saveToStorage();
    }
  }

  private handlePlayerChange = (players: number) => {
    this.setState({ players, history: new PlayerHistory(players) });
    this.updateNames(players);
  };

  private handleNameChange = (name: string, id: number) => {
    const names = this.state.names.slice();
    names[id] = name;
    this.setState({ names });
  };

  private handleClearNames = () => {
    const names = this.state.names.map(() => '');
    this.setState({ names });
  };

  private handleEnterPress = () => {
    if (this.nextButton.current) {
      this.nextButton.current.focus();
    }
    this.addNumber();
  };

  private handleClearClick = () => {
    const history: PlayerHistory = Object.create(this.state.history);
    history.clear();
    this.setState({ history });
    this.handleDialogClose();
  }

  private handleUndoClick = () => {
    const history: PlayerHistory = Object.create(this.state.history);
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

  private handleDialogClose = () => {
    this.setState({ dialog: false });
  };

  private handleDialogOpen = () => {
    if (this.state.dontConfirmClear >= Date.now()) {
      this.handleClearClick();
    } else {
      this.setState({ dialog: true });
    }
  };

  private handleChangeCheck = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      console.log()
      const day = 1000 * 60 * 60 * 24;
      let tomorrow = Date.now() - (Date.now() % day) + day;
      this.setState({ dontConfirmClear: tomorrow });
    }
  };

  private handleSnackDismiss = () => {
    this.setState({ updateSW: false });
  };

  private handleUpdateSW = () => {
    window.location.reload();
  };

  private addNumber = (player?: number) => {
    const history: PlayerHistory = Object.create(this.state.history);
    history.add(player);
    this.setState({ history });
  };

  private updateNames = (players: number) => {
    // Update names array, setting all missing names to null
    const names = this.state.names.slice();
    for (let i = 0; i < players; ++i) {
      names[i] = names[i] || '';
    }
    this.setState({ names });
  };

  private get canUndo () {
    return this.state.history.numberOfCalls > 0
  }

  // Save and restore state to/from localStorage
  private saveToStorage = () => {
    const setStorageAsJSON = (key: string, data: any) => {
      return localStorage.setItem(key, JSON.stringify(data));
    }

    setStorageAsJSON('names', this.state.names);
    setStorageAsJSON('players', this.state.players);
    setStorageAsJSON('data', this.state.history.rawData);
    setStorageAsJSON('dontConfirmClear', this.state.dontConfirmClear);
  };

  private loadFromStorage = () => {
    const getStorageAsJSON = (key: string) => {
      return JSON.parse(localStorage.getItem(key) || 'null');
    }

    const names = getStorageAsJSON('names') || defaults.names;
    const players = getStorageAsJSON('players') || defaults.players;
    const data = getStorageAsJSON('data') || undefined;
    let history: PlayerHistory = new PlayerHistory(players);
    if (data) {
      history.load(data);
    }
    const dontConfirmClear = getStorageAsJSON('dontConfirmClear') || 0;

    return {
      names,
      players,
      history,
      dontConfirmClear,
    }
  };
}

export default withStyles(styles)(App);
