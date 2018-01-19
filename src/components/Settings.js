import React from 'react';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import {
  FormGroup,
  FormControlLabel,
} from 'material-ui/Form';

import Checkbox from 'material-ui/Checkbox';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';


const Settings = (props) => {
  const {
    open,
    onClose,
    showGrid,
    onShowGridChange,
  } = props;

  const showGridCheckbox = (
    <Checkbox
      value="true"
      checked={showGrid}
      onChange={() => onShowGridChange(!showGrid)}
    />);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" style={{ width: '500px' }}>Settings</DialogTitle>
      <DialogContent>
        <FormGroup>
          <FormControlLabel control={showGridCheckbox} label="Show Grid" />
          <Typography type="caption" color="inherit">
            Display grid when zoomed
          </Typography>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

Settings.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showGrid: PropTypes.bool.isRequired,
  onShowGridChange: PropTypes.func.isRequired,
};

export default Settings;
