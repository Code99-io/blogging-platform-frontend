import React, { RefCallback } from 'react';
import { Dayjs } from 'dayjs';
import {
  LocalizationProvider,
  DateTimePicker as MuiDateTimePicker,
  DateTimePickerProps as MuiDateTimePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface DateTimePickerProps extends MuiDateTimePickerProps<Dayjs> {
  dtRef: RefCallback<any>;
  error?: boolean;
  helperText?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDateTimePicker
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

export default DateTimePicker;
