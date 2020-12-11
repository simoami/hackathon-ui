import { withStyles } from '@material-ui/styles';
import React from 'react';
import logo from './logo.png';

const styles = {
  logo: {
    width: 146,
    height: 18,
  }
};
const Logo = ({ classes, ...props }) => {
  return (
    <img
      className={classes.logo}
      alt="Logo"
      src={logo}
      {...props}
    />
  );
};

export default withStyles(styles)(Logo);
