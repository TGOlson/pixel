import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'material-ui/Checkbox';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItemText } from 'material-ui/List';

const SettingsCheckbox = ({ checked }) => (
  <Checkbox
    checked={checked}
    disableRipple
    style={{ color: '#00c853' }}
  />
);

SettingsCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
};


const SettingsMenu = (props) => {
  const {
    anchorEl,
    onClose,
    showGrid,
    onShowGridChange,
    showPixelInfo,
    onShowPixelInfoChange,
  } = props;

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} >
      <MenuItem onClick={() => onShowGridChange(!showGrid)}>
        <SettingsCheckbox checked={showGrid} />
        <ListItemText inset primary="Display grid when zoomed" />
      </MenuItem>
      <MenuItem onClick={() => onShowPixelInfoChange(!showPixelInfo)}>
        <SettingsCheckbox checked={showPixelInfo} />
        <ListItemText primary="Display pixel info on hover" />
      </MenuItem>
    </Menu>
  );
};

SettingsMenu.defaultProps = {
  anchorEl: null,
};

SettingsMenu.propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
  onClose: PropTypes.func.isRequired,
  showGrid: PropTypes.bool.isRequired,
  onShowGridChange: PropTypes.func.isRequired,
  showPixelInfo: PropTypes.bool.isRequired,
  onShowPixelInfoChange: PropTypes.func.isRequired,
};

export default SettingsMenu;
