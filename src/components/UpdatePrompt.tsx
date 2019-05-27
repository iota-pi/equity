import React, { PureComponent } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

export interface Props {
  show: boolean,
  onClose: () => void,
};

class ClearConfirm extends PureComponent<Props> {
  render() {
    return (
      <Snackbar
        open={this.props.show}
        onClose={this.props.onClose}
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
            onClick={this.props.onClose}
          >
            <Close/>
          </IconButton>
        ]}
      />
    )
  }

  private handleUpdateSW = () => {
    window.location.reload();
  };
}

export default ClearConfirm;
