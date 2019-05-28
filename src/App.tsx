import React, { Component, ChangeEvent, Suspense } from 'react';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import createMuiTheme, { Theme } from "@material-ui/core/styles/createMuiTheme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";

import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import NumberInput from './components/NumberInput';
import HistoryDisplay from './components/HistoryDisplay';
import AppBar from './components/AppBar';
import amber from '@material-ui/core/colors/amber';

import * as serviceWorker from './serviceWorker';
import { PlayerHistory } from './History';
import State from './State';

const TopDrawer = React.lazy(() =>
  import(/*webpackChunkName:'TopDrawer'*/ './components/TopDrawer')
);
const ClearConfirm = React.lazy(() =>
  import(/*webpackChunkName:'ClearConfirm'*/ './components/ClearConfirm')
);
const UpdatePrompt = React.lazy(() =>
  import(/*webpackChunkName:'UpdatePrompt'*/ './components/UpdatePrompt')
);

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
            onClear={this.handleDialogOpen}
            onUndo={this.handleUndoClick}
            canUndo={this.canUndo}
          />

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

            <Suspense fallback={null}>
              <TopDrawer
                open={this.state.drawer}
                onClose={this.handleDrawerClose}
                onNameChange={this.handleNameChange}
                onCallClick={this.handleCallClick}
                onClear={this.handleDialogOpen}
                onClearNames={this.handleClearNames}
                {...this.state}
              />

              <ClearConfirm
                show={this.state.dialog}
                dontConfirmClear={this.state.dontConfirmClear >= Date.now()}
                onClose={this.handleDialogClose}
                onClear={this.handleClearClick}
                onChangeConfirmClear={this.handleChangeCheck}
              />

              <UpdatePrompt
                show={this.state.updateSW}
                onClose={this.handleSnackDismiss}
              />
            </Suspense>
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

  private handleChangeCheck = (value: boolean) => {
    if (value) {
      const day = 1000 * 60 * 60 * 24;
      let tomorrow = Date.now() - (Date.now() % day) + day;
      this.setState({ dontConfirmClear: tomorrow });
    } else {
      this.setState({ dontConfirmClear: 0 });
    }
  };

  private handleSnackDismiss = () => {
    this.setState({ updateSW: false });
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
