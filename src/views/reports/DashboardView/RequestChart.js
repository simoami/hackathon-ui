import React, { useState } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import { TimeSeries } from 'pondjs';
import debounce from 'lodash.debounce';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  Typography
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  styler,
  Resizable,
  Legend,
} from 'react-timeseries-charts';
// Data
const data = require('./data.json');

const requests = [];
const connections = [];

(data || []).forEach((val) => {
  const timestamp = moment(new Date(`2015-04-03T${val['time PST']}`));
  const numConnection = val.connections;
  const httpRequests = val['http requests'];
  requests.push([timestamp.toDate().getTime(), httpRequests]);
  connections.push([timestamp.toDate().getTime(), numConnection]);
});

const connectionsSeries = new TimeSeries({
  name: 'connections',
  columns: ['time', 'connections'],
  points: connections
});

const requestsSeries = new TimeSeries({
  name: 'requests',
  columns: ['time', 'requests'],
  points: requests
});

//
// Styles
//

const style = styler([
  { key: 'connections', color: '#2ca02c', width: 2 },
  { key: 'requests', color: '#9467bd', width: 2 }
]);

const useStyles = makeStyles(() => ({
  root: {}
}));

const RequestChart = ({ className, ...rest }) => {
  const classes = useStyles();
  // const theme = useTheme();
  const [active, setActive] = useState({ requests: true, connections: true });
  const [max, setMax] = useState(100);
  const [timerange, setTimerange] = useState(requestsSeries.range());

  const rescale = () => {
    let newMax = 100;
    const maxRequests = requestsSeries.crop(timerange).max('requests');
    if (maxRequests > max && active.requests) newMax = maxRequests;
    const maxConnections = connectionsSeries.crop(timerange).max('connections');
    if (maxConnections > max && active.connections) newMax = maxConnections;
    setMax(newMax);
  };

  const handleRescale = debounce(rescale, 300);
  const handleTimeRangeChange = (range) => {
    setTimerange(range);
    handleRescale(range);
  };

  const handleActiveChange = (key) => {
    const newActive = {
      ...active,
      [key]: !active[key]
    };
    setActive(newActive);
    handleRescale(timerange, newActive);
  };

  const renderChart = () => {
    const charts = [];
    let newMax = max;
    if (active.requests) {
      const maxRequests = requestsSeries.crop(timerange).max('requests');
      if (maxRequests > max) newMax = maxRequests;
      charts.push(
        <LineChart
          key="requests"
          axis="axis1"
          series={requestsSeries}
          columns={['requests']}
          style={style}
          interpolation="curveBasis"
        />
      );
    }
    if (active.connections) {
      const maxConnections = connectionsSeries.crop(timerange).max('connections');
      if (maxConnections > max) newMax = maxConnections;
      charts.push(
        <LineChart
          key="connections"
          axis="axis2"
          series={connectionsSeries}
          columns={['connections']}
          style={style}
          interpolation="curveBasis"
        />
      );
    }

    /* const axisStyle = {
        values: {
            labelColor: "grey",
            labelWeight: 100,
            labelSize: 11
        },
        axis: {
            axisColor: "grey",
            axisWidth: 1
        }
    }; */

    const darkAxis = {
      label: {
        stroke: 'none',
        fill: '#AAA', // Default label color
        fontWeight: 200,
        fontSize: 14,
        font: '"Goudy Bookletter 1911", sans-serif"'
      },
      values: {
        stroke: 'none',
        fill: '#888',
        fontWeight: 100,
        fontSize: 11,
        font: '"Goudy Bookletter 1911", sans-serif"'
      },
      ticks: {
        fill: 'none',
        stroke: '#AAA',
        opacity: 0.2
      },
      axis: {
        fill: 'none',
        stroke: '#AAA',
        opacity: 1
      }
    };

    return (
      <ChartContainer
        title="Incoming vs Filtered"
        style={{
          background: '#201d1e',
          borderRadius: 8,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: '#232122'
        }}
        timeAxisStyle={darkAxis}
        titleStyle={{
          color: '#EEE',
          fontWeight: 500
        }}
        padding={20}
        paddingTop={5}
        paddingBottom={0}
        enableDragZoom
        onTimeRangeChanged={handleTimeRangeChange}
        timeRange={timerange}
        maxTime={requestsSeries.range().end()}
        minTime={requestsSeries.range().begin()}
      >
        <ChartRow height="400">
          <YAxis
            id="axis1"
            label="Incoming Traffic"
            showGrid
            hideAxisLine
            transition={300}
            style={darkAxis}
            labelOffset={-10}
            min={0}
            max={newMax}
            format=",.0f"
            width="60"
            type="linear"
          />
          <Charts>{charts}</Charts>
          <YAxis
            id="axis2"
            label="Filtered Traffic"
            hideAxisLine
            transition={300}
            style={darkAxis}
            labelOffset={12}
            min={0}
            format=",.0f"
            max={newMax}
            width="80"
            type="linear"
          />
        </ChartRow>
      </ChartContainer>
    );
  };

  const legend = [
    {
      key: 'requests',
      label: 'Incoming Traffic',
      disabled: !active.requests
    },
    {
      key: 'connections',
      label: 'Filtered Traffic',
      disabled: !active.connections
    }
  ];

  // const data = {
  //   datasets: [
  //     {
  //       backgroundColor: colors.indigo[500],
  //       data: [18, 5, 19, 27, 29, 19, 20],
  //       label: 'This year'
  //     },
  //     {
  //       backgroundColor: colors.grey[200],
  //       data: [11, 20, 12, 29, 30, 25, 13],
  //       label: 'Last year'
  //     }
  //   ],
  //   labels: ['1 Aug', '2 Aug', '3 Aug', '4 Aug', '5 Aug', '6 Aug']
  // };

  // const options = {
  //   animation: false,
  //   cornerRadius: 20,
  //   layout: { padding: 0 },
  //   legend: { display: false },
  //   maintainAspectRatio: false,
  //   responsive: true,
  //   scales: {
  //     xAxes: [
  //       {
  //         barThickness: 12,
  //         maxBarThickness: 10,
  //         barPercentage: 0.5,
  //         categoryPercentage: 0.5,
  //         ticks: {
  //           fontColor: theme.palette.text.secondary
  //         },
  //         gridLines: {
  //           display: false,
  //           drawBorder: false
  //         }
  //       }
  //     ],
  //     yAxes: [
  //       {
  //         ticks: {
  //           fontColor: theme.palette.text.secondary,
  //           beginAtZero: true,
  //           min: 0
  //         },
  //         gridLines: {
  //           borderDash: [2],
  //           borderDashOffset: [2],
  //           color: theme.palette.divider,
  //           drawBorder: false,
  //           zeroLineBorderDash: [2],
  //           zeroLineBorderDashOffset: [2],
  //           zeroLineColor: theme.palette.divider
  //         }
  //       }
  //     ]
  //   },
  //   tooltips: {
  //     backgroundColor: theme.palette.background.default,
  //     bodyFontColor: theme.palette.text.secondary,
  //     borderColor: theme.palette.divider,
  //     borderWidth: 1,
  //     enabled: true,
  //     footerFontColor: theme.palette.text.secondary,
  //     intersect: false,
  //     mode: 'index',
  //     titleFontColor: theme.palette.text.primary
  //   }
  // };

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader
        action={(
          <Button
            endIcon={<ArrowDropDownIcon />}
            size="small"
            variant="text"
          >
            Last 7 days
          </Button>
        )}
        title="Traffic Optimization"
      />
      <Divider />
      <CardContent>
        <Box
          height={500}
          position="relative"
        >
          {/* <Bar
            data={data}
            options={options}
          /> */}
          <Typography variant="body2">
            <Legend
              type="line"
              style={style}
              categories={legend}
              onSelectionChange={handleActiveChange}
            />
          </Typography>

          <Resizable>{renderChart()}</Resizable>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestChart;
