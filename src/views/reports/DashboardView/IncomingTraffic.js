import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { usePrevious } from 'react-use';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import numeral from 'numeral';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';
import Counter from 'src/components/Counter/Counter';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const IncominTraffic = ({ className, value, ...rest }) => {
  const classes = useStyles();
  const previous = usePrevious(value);
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              INCOMING TRAFFIC
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              <Counter start={previous} end={value} duration={1.5}>
                {({ value }) => (
                  <Typography
                    color="textPrimary"
                    variant="h3"
                  >
                    {numeral(value).format('(0,0)')}
                  </Typography>
                )}
              </Counter>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          <ArrowUpwardIcon className={classes.differenceIcon} />
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            12%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Since last update
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

IncominTraffic.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
};

export default IncominTraffic;
