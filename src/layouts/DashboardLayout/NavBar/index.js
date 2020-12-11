import React, { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
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
  Grid
} from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {
  Save as SaveIcon
} from 'react-feather';

import * as Yup from 'yup';
import { Field, Formik } from 'formik';

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
}));

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

  const publisherOptions = [
    { id: 'cbsi', name: 'CBSi (Platinum)' },
    { id: 'nypost', name: 'NY Post (Gold)' },
    { id: 'sharethrough', name: 'ShareThrough (Silver)' },
  ];

  const presetOptions = [
    { id: 'default', name: 'Default' }
  ];

  const domainOptions = [
    { domain: 'cbsi.com', publisherId: 'cbsi' },
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
    { id: 'dsp1', name: 'DSP 1' },
    { id: 'dsp2', name: 'DSP 2' },
    { id: 'dsp3', name: 'DSP 3' },
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

  const initialValues = {
    publisher: 'cbsi',
    preset: 'default',
    domain: domainOptions.filter((option) => ['cbsi.com'].includes(option.domain)),
    adSize: adSizeOptions.filter((option) => ['728x90'].includes(option)),
    device: deviceOptions.filter((option) => ['desktop'].includes(option.id)),
    dsp: dspOptions.filter((option) => ['dsp1'].includes(option.id)),
    country: 'us',
    userMatch: true,
    viewability: 0, // between 0 and 1
    directInventory: true,
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
                {({ field, meta }) => (
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    label="Select Publisher"
                    select
                    {...field}
                    helperText={meta.touched ? meta.error : null}
                    error={meta.touched && !!meta.error}
                  >
                    {publisherOptions.map((option) => (
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
                    {presetOptions.map((option) => (
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
                    />
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
                    >
                      {countryOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                      ))}
                    </TextField>
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
                    >
                      {userMatchOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Box>

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
                    >
                      {viewabilityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.name}</MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </Box>

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

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
