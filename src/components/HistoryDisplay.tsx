import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from '../History';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Typography from '@material-ui/core/Typography';
import FlipMove from 'react-flip-move';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'absolute',
    left: -100,
    right: -100,
    top: 0,
    bottom: 0,
  },
  scrollable: {
    display: 'flex',
    flexDirection: 'column-reverse',
    overflowY: 'scroll',
    zIndex: 10,
    paddingLeft: 100 + theme.spacing.unit * 2,
    paddingRight: 100 + theme.spacing.unit * 2,
    height: '100%',
  },
  historyContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    minHeight: `calc(${theme.typography.h1.fontSize} * 2)`,
    '&::before, &::after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 100,
      height: theme.spacing.unit * 20,
    },
    '&::before': {
      top: 0,
      background: `linear-gradient(${theme.palette.background.default}, transparent)`,
    },
    '&::after': {
      bottom: 0,
      background: `linear-gradient(transparent, ${theme.palette.background.default})`,
    },
  },
  historyRow: {
    textAlign: 'center',
    width: '100%',
    marginBlock: 0,
    '&>span': {
      transition: 'all 0.3s ease',
    },
    [theme.breakpoints.only('xs')]: {
      fontSize: `calc(${theme.typography.h2.fontSize} * 0.85)`,
      '&:last-of-type': {
        '&>span': {
          color: theme.palette.primary.main,
          fontSize: `calc(${theme.typography.h1.fontSize})`,
        },
      },
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: `calc(${theme.typography.h2.fontSize})`,
      '&:last-of-type': {
        '&>span': {
          color: theme.palette.primary.main,
          fontSize: `calc(${theme.typography.h1.fontSize} * 1.15)`,
        },
      },
    },
  },
  verticalSpacer: {
    height: theme.spacing.unit * 20,
  },
});

export interface Props extends WithStyles<typeof styles> {
  history: History,
  names: string[],
}

class HistoryDisplay extends Component<Props> {
  private scrollBarWidth: number = 0

  render() {
    const history = this.props.history.formatted();
    const classes = this.props.classes;

    return (
      <div className={classes.root}>
        <div
          className={classes.scrollable}
          ref="scrollable"
          style={{marginRight: -this.scrollBarWidth}}
        >
          <div className={classes.historyContainer}>
            <FlipMove
              enterAnimation={{
                from: { opacity: '0', transform: 'translateY(50px)' },
                to: { opacity: '1', transform: 'translateY(0px)' },
              }}
              leaveAnimation={{
                from: { opacity: '1', transform: 'translateY(0px)' },
                to: { opacity: '0', transform: 'translateY(50px)' },
              }}
              easing="ease-out"
              duration={300}
            >
              <div className={classes.verticalSpacer}></div>
              {history.map((numbers, i) => (
                <Typography
                  key={`historyRow-${i}`}
                  variant="h1"
                  align="center"
                  className={classes.historyRow}
                >
                  {this.renderPlayers(numbers)}
                </Typography>
              ))}
              <div className={classes.verticalSpacer}></div>
            </FlipMove>
          </div>
        </div>
      </div>
    )
  }

  private renderPlayers = (players: number[]) => {
    const toString = (id: number) => {
      return this.props.names[id] || (id + 1).toString()
    }

    return (
      <React.Fragment>
        {players.map((p, i) => (
          <React.Fragment key={`player-${i}`}>
            {i > 0 && <span>, </span>}
            <span>{toString(p)}</span>
          </React.Fragment>
        ))}
      </React.Fragment>
    )
  }

  componentDidMount () {
    // Get scrollbar width
    const el = ReactDOM.findDOMNode(this.refs.scrollable) as HTMLElement;
    this.scrollBarWidth = el.offsetWidth - el.clientWidth;
  }

  componentDidUpdate () {
    this.scrollToBottom();
  }

  private scrollToBottom = () => {
    const el = ReactDOM.findDOMNode(this.refs.scrollable) as HTMLElement;
    el.scroll({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }
}

export default withStyles(styles)(HistoryDisplay);
