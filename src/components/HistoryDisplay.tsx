import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { History } from '../History';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'absolute',
    left: -100,
    right: -100,
    top: 0,
    bottom: 0,
  },
  scrollable: {
    overflowY: 'auto',
    zIndex: 10,
    paddingLeft: 100 + theme.spacing.unit * 2,
    paddingRight: 100 + theme.spacing.unit * 2,
    height: '100%',
    '&::before,&::after': {
      display: 'block',
      content: '""',
      height: `calc(50% - ${theme.typography.h1.fontSize || '6rem'})`,
    },
  },
  historyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minHeight: `calc(${theme.typography.h1.fontSize} * 2)`,
    '&::before, &::after': {
      display: 'block',
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
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
  },
  larger: {
    fontSize: theme.typography.h2.fontSize,
    '&:last-child>h1': {
      fontSize: `calc(${theme.typography.h1.fontSize} * 1.15)`,
    }
  },
})

export interface Props extends WithStyles<typeof styles> {
  history: History,
  names: string[],
}

class HistoryDisplay extends Component<Props> {
  render() {
    const history = this.props.history.sorted();
    const classes = this.props.classes;

    return (
      <div className={classes.root}>
        <div className={classes.scrollable} ref="scrollable">
          <div className={classes.historyContainer}>
            {history.map((numbers, i) => (
              <div className={[classes.historyRow, classes.larger].join(' ')} key={`historyRow-${i}`}>
                <Typography
                  variant={i < history.length - 1 ? 'h2' : 'h1'}
                  color={i < history.length - 1 ? 'default' : 'primary'}
                >
                  {numbers.map(x => this.playerToString(x)).join(', ')}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  private playerToString = (id: number) => {
    return this.props.names[id] || (id + 1).toString()
  }

  componentDidUpdate () {
    const el = ReactDOM.findDOMNode(this.refs.scrollable) as Element;
    const offset = el.scrollHeight - el.scrollTop - el.clientHeight;
    el.scroll({
      top: el.scrollHeight,
      behavior: offset > 100 ? 'smooth' : 'auto',
    });
  }
}

export default withStyles(styles)(HistoryDisplay);
