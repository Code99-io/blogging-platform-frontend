import React, { RefCallback } from 'react';
import { Dayjs } from 'dayjs';
import {
  LocalizationProvider,
  TimePicker as MuiTimePicker,
  TimePickerProps as MuiTimePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface TimePickerProps extends MuiTimePickerProps<Dayjs> {
  dtRef: RefCallback<any>;
  error?: boolean;
  helperText?: string;
}

const TimePicker: React.FC<TimePickerProps> = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiTimePicker
        {...props}
        ref={props.dtRef}
        slotProps={{
          textField: {
            size: 'small',
            variant: 'outlined',
            fullWidth: true,
            error: props.error,
            helperText: props.helperText,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default TimePicker;
