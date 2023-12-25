import React, { RefCallback } from 'react';
import { Dayjs } from 'dayjs';
import {
  LocalizationProvider,
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface DatePickerProps extends MuiDatePickerProps<Dayjs> {
  dtRef: RefCallback<any>;
  error?: boolean;
  helperText?: string;
}

const DatePicker: React.FC<DatePickerProps> = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
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

export default DatePicker;
