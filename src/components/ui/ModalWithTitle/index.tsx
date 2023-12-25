import {
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Modal,
  ModalProps,
} from '@mui/material';

import * as s from './styles';
import CircularProgress from '../CircularProgress';

export interface ModalWithTitleProps {
  title: string;
  subTitle?: string;
  open: boolean;
  onClose?: () => void;
  children: React.ReactElement;
  renderAction?: () => React.ReactElement;
  form?: {
    onSubmit: ModalProps['onSubmit'];
  };
  disableContentPadding?: boolean;
  loading?: boolean;
}

const ModalWithTitle: React.FC<ModalWithTitleProps> = ({
  title,
  subTitle,
  open,
  onClose,
  children,
  renderAction,
  form,
  disableContentPadding,
  loading,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      component={form ? 'form' : 'div'}
      onSubmit={form?.onSubmit}
      keepMounted={false}
    >
      <s.Container sx={{ width: { xs: '80%', sm: '500px' } }}>
        <CardHeader title={title} subheader={subTitle} />
        <Divider />
        <CardContent
          sx={{
            p: disableContentPadding ? 0 : 3,
            maxHeight: '60vh',
            overflow: 'scroll',
          }}
        >
          {children}
        </CardContent>
        <Divider />
        <CardActions sx={{ p: 3, justifyContent: 'flex-end' }}>
          {renderAction && renderAction()}
        </CardActions>
        {loading && <CircularProgress size={40} />}
      </s.Container>
    </Modal>
  );
};
export default ModalWithTitle;
