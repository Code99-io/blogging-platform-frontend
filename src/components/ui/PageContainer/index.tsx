import React from 'react';
import { Button, TextField, Typography } from '@mui/material';

import * as s from './styles';

export interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  newButtonText: string;
  onNewButtonClick: () => void;
  onSearch: (searchText: string) => void;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  newButtonText,
  onNewButtonClick,
  onSearch,
}) => {
  return (
    <s.Container>
      <s.Header spacing={2} direction={'row'}>
        <Typography variant="h5">{title}</Typography>
        <s.HeaderRightContainer direction={'row'} spacing={3}>
          <TextField
            size="small"
            label="Search"
            sx={s.styledForSearchField}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Button variant="contained" onClick={onNewButtonClick}>
            {newButtonText}
          </Button>
        </s.HeaderRightContainer>
      </s.Header>
      {children}
    </s.Container>
  );
};

export default PageContainer;
