import { IconButton, Stack, SvgIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export interface GridActionProps {
  onEdit: () => void;
  onDelete: () => void;
}

const GridAction: React.FC<GridActionProps> = ({ onEdit, onDelete }) => {
  return (
    <Stack direction={'row'} alignItems={'center'}>
      <IconButton size="small" onClick={onEdit}>
        <SvgIcon fontSize="small">
          <EditIcon />
        </SvgIcon>
      </IconButton>
      <IconButton size="small" onClick={onDelete}>
        <SvgIcon fontSize="small">
          <DeleteOutlineIcon />
        </SvgIcon>
      </IconButton>
    </Stack>
  );
};

export default GridAction;
