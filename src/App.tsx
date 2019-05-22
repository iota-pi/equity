import React, { Component } from 'react';
// import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import NumberInput from './components/NumberInput';
import HistoryDisplay from './components/HistoryDisplay';
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
  open: boolean,
  history: History,
  players: number,
};

class App extends Component<Props, State> {
  state = {
    open: true,
    history: new History(1),
    players: 1,
  };
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
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="Open Drawer"
              onClick={this.toggleDrawer}
              className={classes.iconButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Equity
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.pageContent}>
          <div className={classes.appBarSpacer} />

          <section className={classes.section}>
            <div>
              <NumberInput
                label="Number of Players"
                variant="outlined"
                value={this.state.players}
                fullWidth
                autoFocus
                onChange={this.handlePlayerChange}
                onEnterPress={this.handleEnterPress}
              />
            </div>
          </section>

          <section className={[classes.section, classes.main].join(' ')}>
            <HistoryDisplay
              history={this.state.history}
            />
          </section>
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

  private toggleDrawer = () => {
    this.setState({ open: !this.state.open });
  };

  private handlePlayerChange = (players: number) => {
    this.setState({ players, history: new History(players) });
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

  private addNumber () {
    const history: History = Object.create(this.state.history);
    history.add();
    this.setState({ history })
  }
}

export default withStyles(styles)(App);
