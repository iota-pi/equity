import React, { Component, ChangeEvent } from 'react';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import NumberInput from './components/NumberInput';
import HistoryDisplay from './components/HistoryDisplay';
import TextField from "@material-ui/core/TextField";
import { History } from './History';

// Todo change History to be class containing entries and with relevant methods

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  iconButton: {
    marginLeft: 6,
    marginRight: 6,
  },
  appBarSpacer: theme.mixins.toolbar,
  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  section: {
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
  },
  paddedGrid: {
    marginTop: -8,
    marginBottom: -8,
    marginLeft: -12,
    marginRight: -12,
    '&>*': {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
    },
  },
  topDrawer: {
    maxHeight: '75vh',
  },
  slightPadding: {
    padding: 8,
  },
  main: {
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden', /* TODO: may be able to remove */
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 18,
    padding: 12,
  },
});

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
          <Toolbar
            // disableGutters
          >
            <Typography variant="h6" color="inherit">
              Equity
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.pageContent}>
          <div className={classes.appBarSpacer} />

          <section className={classes.section}>
            <Grid container className={classes.paddedGrid}>
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

      drawerContent = (
        <div className={classes.slightPadding}>
          <Grid container spacing={8}>
            {countArray.map((count, i) => (
              <Grid item xs={3} key={`playerCounts-${i}`}>
                <Typography variant="h4">
                  {this.playerToString(i)}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </div>
      )
    }

    return (
      <div>
        <div className={classes.topDrawer}>
          {drawerContent}
        </div>

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

  private handleNextClick = () => {
    this.addNumber();
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

  private addNumber = () => {
    const history: History = Object.create(this.state.history);
    history.add();
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
