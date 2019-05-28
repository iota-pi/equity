import React, { PureComponent, ChangeEvent } from 'react';
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) => {
  return createStyles({
    moreTopPadding: {
      paddingTop: theme.spacing(2),
    },
  });
};

export interface Props extends WithStyles<typeof styles> {
  show: boolean,
  dontConfirmClear: boolean,
  onClose: () => void,
  onChangeConfirmClear: (value: boolean) => void,
  onClear: () => void,
};

class ClearConfirm extends PureComponent<Props> {
  render() {
    const { classes } = this.props;

    return (
      <Dialog
        open={this.props.show}
        onClose={this.props.onClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogContent className={classes.moreTopPadding}>
          <Typography>
            Clear player call history? This cannot be undone.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={this.props.dontConfirmClear}
                onChange={this.handleChange}
                color="primary"
              />
            }
            label="Don't ask again today"
          />
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={this.props.onClose}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={this.props.onClear}>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeConfirmClear(!event.target.checked);
  }
}

export default withStyles(styles)(ClearConfirm);
