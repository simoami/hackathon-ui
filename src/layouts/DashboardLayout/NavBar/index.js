import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  Typography,
  makeStyles,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  Grid,
  Slider,
} from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {
  Save as SaveIcon
} from 'react-feather';

import * as Yup from 'yup';
import { Field, Formik } from 'formik';
import { debounce } from 'lodash';

const adSizeFilter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  fieldDivider: {
    margin: theme.spacing(2, 0)
  },
  publisherEntry: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  plan: {
    ...theme.typography.overline,
    background: '#eeeeee',
    borderRadius: 3,
    padding: '3px 6px',
    marginLeft: theme.spacing(0.5),
    float: 'right',
    lineHeight: '1'
  },
  planplatinum: {
    background: 'linear-gradient( -72deg, #dedeff, #ffffff 16%, #dedeff 21%, #ffffff 24%, #d5d5f3 27%, #dedeff 36%, #ffffff 45%, #ffffff 60%, #dedeff 72%, #ffffff 80%, #dedeff 84%, #a3a3c3 )',
  },
  plangold: {
    background: 'linear-gradient( -72deg, #ffde45, #ffffff 16%, #ffde45 21%, #ffffff 24%, #e8caae 27%, #ffde45 36%, #ffffff 45%, #ffffff 60%, #ffde45 72%, #ffffff 80%, #ffde45 84%, #fdbb7e )',
  },
  plansilver: {
    background: 'linear-gradient( -72deg, #dedede, #ffffff 16%, #dedede 21%, #ffffff 24%, #d0d0d0 27%, #dedede 36%, #ffffff 45%, #ffffff 60%, #dedede 72%, #ffffff 80%, #dedede 84%, #989898 )',
  },

}));

const viewabilityMarks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 100,
    label: '100%',
  },
];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const validationSchema = Yup.object().shape({
  publisher: Yup.string().required('Publisher is required'),
  preset: Yup.string(),
  domain: Yup.string(),
  adSize: Yup.string(),
});

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const [selectedPublisher, setSelectedPublisher] = useState('cbsi');
  const planOptions = {
    platinum: {
      features: {
        viewability: 'full', // slider
        domain: true,
        country: true,
        product: true,
        device: true,
        adSize: true,
        userMatch: true,
        dsp: true,
        directInventory: true,
      }
    },
    gold: {
      features: {
        viewability: 'on', // on / off
        domain: true,
        country: true,
        product: true,
        device: true,
        adSize: true,
        userMatch: true,
        dsp: true,
        directInventory: false,
      }

    },
    silver: {
      features: {
        viewability: 'off', // disabled
        domain: true,
        country: true,
        product: true,
        device: true,
        adSize: true,
        userMatch: false,
        dsp: false,
        directInventory: false,
      }
    }
  };
  const publisherOptions = [
    {
      id: 'cbsi',
      name: 'CBSi',
      plan: 'platinum',
      features: planOptions.platinum.features,
    },
    {
      id: 'nypost',
      name: 'NY Post',
      plan: 'gold',
      features: planOptions.gold.features,
    },
    {
      id: 'sharethrough',
      name: 'ShareThrough',
      plan: 'silver',
      features: planOptions.silver.features,
    },
  ];

  const presetOptions = [
    {
      id: 'default',
      name: 'Default',
      publisherId: 'cbsi',
      values: {
        domain: 'cbsi.com',
        adSize: ['728x90', '768x90'],
        device: 'desktop',
        dsp: 'bidswitch',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
    {
      id: 'lite',
      name: 'Lite',
      publisherId: 'cbsi',
      values: {
        domain: 'cbsi.com',
        adSize: ['728x90'],
        device: 'desktop',
        dsp: 'rubicon',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      publisherId: 'cbsi',
      values: {
        domain: 'cbsi.com',
        adSize: ['728x90'],
        device: 'mobile',
        dsp: 'bidswitch',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
    {
      id: 'default',
      name: 'Default',
      publisherId: 'nypost',
      values: {
        domain: 'nypost.com',
        adSize: ['728x90'],
        device: 'tablet',
        dsp: 'rubicon',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
    {
      id: 'lite',
      name: 'Lite',
      publisherId: 'nypost',
      values: {
        domain: 'nypost.com',
        adSize: ['728x90'],
        device: 'desktop',
        dsp: 'rubicon',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      publisherId: 'nypost',
      values: {
        domain: 'nypost.com',
        adSize: ['728x90'],
        device: 'mobile',
        dsp: 'rubicon',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
    {
      id: 'default',
      name: 'Default',
      publisherId: 'sharethrough',
      values: {
        domain: 'sharethrough.com',
        adSize: ['768x90'],
        device: 'tablet',
        dsp: 'bidswitch',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
    {
      id: 'lite',
      name: 'Lite',
      publisherId: 'sharethrough',
      values: {
        domain: 'sharethrough.com',
        adSize: ['728x90'],
        device: 'mobile',
        dsp: 'bidswitch',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      publisherId: 'sharethrough',
      values: {
        domain: 'sharethrough.com',
        adSize: ['728x90'],
        device: 'tablet',
        dsp: 'bidswitch',
        country: 'us',
        userMatch: true,
        viewability: 0,
        directInventory: true,
      }
    },
  ];

  const domainOptions = [
    { domain: 'cbsi.com', publisherId: 'cbsi' },
    { domain: 'tvguide.com', publisherId: 'cbsi' },
    { domain: '247sports.com', publisherId: 'cbsi' },
    { domain: 'nypost.com', publisherId: 'nypost' },
    { domain: 'sharethrough.com', publisherId: 'sharethrough' },
  ];

  const adSizeOptions = [
    '120x140',
    '120x600',
    '160x240',
    '160x600',
    '300x250',
    '336x280',
    '468x60',
    '468x80',
    '468x90',
    '480x60',
    '600x90',
    '700x70',
    '720x90',
    '728x90',
    '768x90',
  ];

  const deviceOptions = [
    { id: 'desktop', name: 'Desktop' },
    { id: 'tablet', name: 'Tablet' },
    { id: 'mobile', name: 'Mobile' },
  ];

  const dspOptions = [
    { id: 'bidswitch', name: 'BidSwitch' },
    { id: 'rubicon', name: 'Rubicon' },
    { id: 'openx', name: 'Open X' },
  ];

  const countryOptions = [
    { id: 'us', name: 'United States' },
    { id: 'international', name: 'International' },
  ];

  const userMatchOptions = [
    { value: false, name: 'All' },
    { value: true, name: 'Matched Users Only' },
  ];

  const viewabilityOptions = [
    { value: 0, name: 'All' },
    { value: 1, name: 'Viewable Only' },
  ];

  const directInventoryOptions = [
    { value: false, name: 'All' },
    { value: true, name: 'Direct Only' },
  ];

  const selectedDefaults = presetOptions.find((p) => p.publisherId === selectedPublisher && p.id === 'default')?.values;
  const initialValues = {
    publisher: selectedPublisher,
    preset: 'default',
    // domain: selectedDefaults.domain,
    domain: domainOptions.filter((option) => [selectedDefaults.domain].includes(option.domain)),
    adSize: adSizeOptions.filter((option) => selectedDefaults?.adSize?.includes(option)),
    device: deviceOptions.filter((option) => [selectedDefaults.device].includes(option.id)),
    dsp: dspOptions.filter((option) => [selectedDefaults.dsp].includes(option.id)),
    country: selectedDefaults.country,
    userMatch: selectedDefaults.userMatch,
    viewability: selectedDefaults.viewability, // between 0 and 1
    directInventory: selectedDefaults.directInventory,
  };

  const handleSubmit = useCallback(
    (values, { setSubmitting }) => {
      console.log('Submitting...', values);
      setSubmitting(false);
    },
    [],
  );

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleSubmit,
        handleReset,
        isSubmitting,
        dirty,
        values
      }) => (
        <form onSubmit={handleSubmit}>

          <Box
            height="100%"
            display="flex"
            flexDirection="column"
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              p={2}
            >
              <Field name="publisher">
                {({ field, form, meta }) => (
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Select Publisher"
                    select
                    {...field}
                    helperText={meta.touched ? meta.error : null}
                    error={meta.touched && !!meta.error}
                    onChange={(e) => {
                      setSelectedPublisher(e.target.value);
                      form.setFieldValue(field.name, e.target.value);
                    }}
                  >
                    {publisherOptions.map((option) => (
                      <MenuItem key={option.id} className={classes.publisherEntry} value={option.id}>
                        <span>{option.name}</span>
                        <span className={clsx(classes.plan, classes[`plan${option.plan}`])}>{option.plan}</span>
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
            </Box>
            <Divider />

            <Box
              display="flex"
              flexDirection="column"
              bgcolor="background.main"
              p={2}
            >
              <Typography variant="h5" paragraph>Presets</Typography>
              <Field name="preset">
                {({ field, meta }) => (

                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    select
                    {...field}
                    helperText={meta.touched ? meta.error : null}
                    error={meta.touched && !!meta.error}
                  >
                    {presetOptions.filter(
                      (option) => option.publisherId === values.publisher
                    ).map((option) => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </TextField>
                )}
              </Field>
            </Box>
            <Divider />

            <Box
              display="flex"
              flexDirection="column"
              bgcolor="background.main"
              p={2}
            >
              <Typography variant="h5" paragraph>Dimensions</Typography>

              <Box py={2}>
                <Field name="domain">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiple
                      options={domainOptions.filter(
                        (option) => option.publisherId === values.publisher
                      )}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.domain}
                      renderOption={(option, { selected }) => (
                        <>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.domain}
                        </>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Domain"
                          placeholder="Select a domain"
                          helperText={meta.touched ? meta.error : null}
                          error={meta.touched && !!meta.error}
                        />
                      )}
                      {...field}
                      onChange={(event, newValue) => form.setFieldValue(field.name, newValue)}
                      disabled={!publisherOptions.find((p) => p.id === values.publisher)?.features.domain}
                    />
                  )}
                </Field>
              </Box>
              <Box py={2}>
                <Field name="adSize">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiple
                      options={adSizeOptions}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option}
                      renderOption={(option, { selected }) => (
                        <>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option}
                        </>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Ad Size"
                          placeholder="Select an ad-size"
                          helperText={meta.touched ? meta.error : null}
                          error={meta.touched && !!meta.error}
                        />
                      )}
                      {...field}
                      onChange={(event, newValue) => {
                        console.log('>>', newValue);
                        if (typeof newValue === 'string') {
                          form.setFieldValue(field.name, newValue);
                        } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          form.setFieldValue(field.name, newValue.inputValue);
                        } else {
                          form.setFieldValue(field.name, newValue);
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = adSizeFilter(options, params);
                        // Suggest the creation of a new value
                        if (params.inputValue !== '') {
                          filtered.push(params.inputValue);
                        }
                        return filtered;
                      }}
                      disabled={!publisherOptions.find((p) => p.id === values.publisher)?.features.adSize}
                    />

                  )}
                </Field>
              </Box>

              <Box py={2}>

                <Field name="device">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiple
                      options={deviceOptions}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      renderOption={(option, { selected }) => (
                        <>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Devices"
                          placeholder="Select a device"
                          helperText={meta.touched ? meta.error : null}
                          error={meta.touched && !!meta.error}
                        />
                      )}
                      {...field}
                      onChange={(event, newValue) => form.setFieldValue(field.name, newValue)}
                      disabled={!publisherOptions.find((p) => p.id === values.publisher)?.features.device}
                    />
                  )}
                </Field>
              </Box>

              <Box py={2}>
                <Field name="country">
                  {({ field, meta }) => (
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      select
                      label="Country"
                      {...field}
                      helperText={meta.touched ? meta.error : null}
                      error={meta.touched && !!meta.error}
                      disabled={!publisherOptions.find((p) => p.id === values.publisher)?.features.country}
                    >
                      {countryOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Box>

              <Box py={2}>
                <Field name="dsp">
                  {({ field, form, meta }) => (
                    <Autocomplete
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiple
                      options={dspOptions}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.name}
                      renderOption={(option, { selected }) => (
                        <>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="DSP"
                          placeholder="Select a dsp"
                          helperText={meta.touched ? meta.error : null}
                          error={meta.touched && !!meta.error}
                        />
                      )}
                      {...field}
                      onChange={(event, newValue) => form.setFieldValue(field.name, newValue)}
                      disabled={!publisherOptions.find((p) => p.id === values.publisher)?.features.dsp}
                    />
                  )}
                </Field>
              </Box>

              <Box py={2}>
                <Field name="userMatch">
                  {({ field, meta }) => (
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      select
                      label="User Match"
                      {...field}
                      helperText={meta.touched ? meta.error : null}
                      error={meta.touched && !!meta.error}
                      disabled={!publisherOptions.find((p) => p.id === values.publisher)?.features.userMatch}
                    >
                      {userMatchOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Box>

              {publisherOptions.find((p) => p.id === values.publisher)?.features.viewability === 'full'
                ? (
                  <Box py={1} px={2}>
                    <Typography variant="caption" id="discrete-slider-custom" gutterBottom>
                      Viewability
                    </Typography>
                    <Field name="viewability">
                      {({ field, form, meta }) => (
                        <Slider
                          value={field.value}
                          aria-labelledby="discrete-slider-custom"
                          step={5}
                          valueLabelDisplay="auto"
                          marks={viewabilityMarks}
                          onChange={debounce((e, value) => form.setFieldValue(field.name, value), 10)}
                        />
                      )}
                    </Field>
                  </Box>
                  )
                : null}

              {publisherOptions.find((p) => p.id === values.publisher)?.features.viewability === 'on'
                ? (
                  <Box py={2}>
                    <Field name="viewability">
                      {({ field, meta }) => (
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          select
                          label="Viewability"
                          {...field}
                          helperText={meta.touched ? meta.error : null}
                          error={meta.touched && !!meta.error}
                          disabled={!publisherOptions.find((p) => p.id === values.publisher)?.features.viewability === 'on'}
                        >
                          {viewabilityOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    </Field>
                  </Box>
                  )
                : null}

              <Box py={2}>
                <Field name="directInventory">
                  {({ field, meta }) => (
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      select
                      label="Direct Inventory"
                      {...field}
                      helperText={meta.touched ? meta.error : null}
                      error={meta.touched && !!meta.error}
                      disabled={!publisherOptions.find((p) => p.id === values.publisher)?.features.directInventory}
                    >
                      {directInventoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Box>

            </Box>

            <Box
              display="flex"
              flexDirection="column"
              bgcolor="background.main"
              p={2}
            >
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    color="primary"
                    fullWidth
                    startIcon={<SaveIcon width={16} height={16} />}
                    onClick={handleSubmit}
                    size="small"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>

                </Grid>
                <Grid item xs={6}>
                  <Button
                    color="default"
                    fullWidth
                    size="small"
                    variant="contained"
                    onClick={handleReset}
                    disabled={!dirty || isSubmitting}
                  >
                    Reset
                  </Button>

                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
