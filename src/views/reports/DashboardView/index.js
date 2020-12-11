import React, { useState } from 'react';
import { useInterval } from 'react-use';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

import RequestChart from './RequestChart';
import FilteredTraffic from './FilteredTraffic';
import IncominTraffic from './IncomingTraffic';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

function random(max = 100) {
  return Math.round(Math.random() * max);
}

const Dashboard = () => {
  const classes = useStyles();

  const [incoming, setIncoming] = useState(24000);
  const [filtered, setFiltered] = useState(1600);

  useInterval(
    () => {
      const newRequests = random(8);
      const shouldUpdate = random(10) > 4;
      if (!shouldUpdate) return;
      setIncoming(incoming + newRequests);
      setFiltered(filtered + random(newRequests));
    },
    1000
  );

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            sm={6}
            xs={12}
          >
            <IncominTraffic value={incoming} />
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
          >
            <FilteredTraffic value={filtered} />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <RequestChart />
          </Grid>
          {/* <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
