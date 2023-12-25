import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

export interface DeleteDialogProps {
  open: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onDelete,
  onCancel,
}) => {
  return (
    <Dialog open={open} keepMounted={false}>
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>Are you sure you want to delete?</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="error" onClick={onDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
