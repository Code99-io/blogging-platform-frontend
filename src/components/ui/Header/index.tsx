import * as React from 'react';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { AppBar, Box, Menu, MenuItem, Stack } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

import { useSingOut } from '../../../queries';
import { appRoutes } from '../../../constants';

export interface HeaderProps extends MuiAppBarProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const signOutMutation = useSingOut();

  const [accountMenuAnchorEl, setAccountMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const isAccountMenuOpen = Boolean(accountMenuAnchorEl);

  const handleDrawerOpen = () => {
    setOpen && setOpen(!open);
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  const handleMyAccountClick = () => {
    navigate(appRoutes.MY_ACCOUNT);
    handleAccountMenuClose();
  };

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  const accountMenuId = 'account-menu';
  const renderAccountMenu = (
    <Menu
      anchorEl={accountMenuAnchorEl}
      id={accountMenuId}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      open={isAccountMenuOpen}
      onClose={handleAccountMenuClose}
    >
      <MenuItem onClick={handleMyAccountClick}>My account</MenuItem>
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Box flexGrow={1} />
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={handleAccountMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      {renderAccountMenu}
    </>
  );
};

export default Header;
