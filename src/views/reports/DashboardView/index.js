import React, { useCallback, useState } from 'react';
import { useInterval } from 'react-use';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

import {
  TimeSeries,
  TimeRange,
  TimeEvent,
  Pipeline as pipeline,
  Stream,
  EventOut,
  percentile,
} from 'pondjs';

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
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [time, setTime] = useState(new Date());
  const [events, setEvents] = useState([]);

  const getNewEvent = (t, val) => {
    return new TimeEvent(t, val);
  };

  const stream = useCallback(() => new Stream(), []);

  // stream
  // .groupByWindow({
  //   window: '5m',
  //   trigger: 1 // per event
  // })
  // .emitOn('discard')
  // .aggregate({
  //   value: { value: percentile(90) }
  // })
  // .to(EventOut, (event) => {
  //   incomingRequests.push(event);
  //   setIncomingRequests(incomingRequests);
  // });

  // pipeline()
  //   .from(stream)
  //   .windowBy('5m')
  //   .emitOn('discard')
  //   .aggregate({
  //     value: { value: percentile(50) }
  //   })
  //   .to(EventOut, (event) => {
  //     filteredRequests.push(event);
  //     setFilteredRequests(filteredRequests);
  //   });

  const increment = 60 * 1000; // minute

  useInterval(
    () => {
      const newRequests = random(8);
      const shouldUpdate = random(10) > 3;
      if (!shouldUpdate) return;
      setIncoming(incoming + newRequests);
      setFiltered(filtered + random(newRequests));
      // const t = new Date(time.getTime() + increment);
      // const event = getNewEvent(t, incoming + newRequests);
      // const newEvents = [
      //   ...events,
      //   event
      // ];
      // setTime(t);
      // setEvents(newEvents);
      // // Let our aggregators process the event
      // stream.addEvent(event);
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
