import { Box } from '@mui/material';
import MuiCircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';

import * as s from './styles';

export interface CircularProgressProps {
  size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ size = 50 }) => {
  return (
    <s.Container>
      <Box sx={{ position: 'relative', maxWidth: size }}>
        <MuiCircularProgress
          variant="determinate"
          sx={{
            color: (theme) =>
              theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
          }}
          size={size}
          thickness={4}
          value={100}
        />
        <MuiCircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={size}
          thickness={4}
        />
      </Box>
    </s.Container>
  );
};

export default CircularProgress;
