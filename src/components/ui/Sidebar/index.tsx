import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Toolbar,
  useMediaQuery,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import { appRoutes } from '../../../constants';

const sidebarItems = [
  {
    text: 'Home',
    icon: <HomeIcon />,
    path: appRoutes.HOME,
  },
  {
    text: 'Blogs',
    path: appRoutes.BLOGS,
  },
  {
    text: 'Categories',
    path: appRoutes.CATEGORIES,
  },
  {
    text: 'Tags',
    path: appRoutes.TAGS,
  },
  {
    text: 'Blog Categories',
    path: appRoutes.BLOG_CATEGORIES,
  },
  {
    text: 'Blog Tags',
    path: appRoutes.BLOG_TAGS,
  },
  {
    text: 'Drafts',
    path: appRoutes.DRAFTS,
  },
  {
    text: 'Comments',
    path: appRoutes.COMMENTS,
  },
  {
    text: 'Likes',
    path: appRoutes.LIKES,
  },
];

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { pathname } = useLocation();
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));

  const content = (
    <Box>
      <Toolbar />
      <Divider />
      <Box component="nav">
        <List>
          {sidebarItems.map((item, index) => {
            const active = item.path ? pathname === item.path : false;
            return (
              <ListItem key={`${index}`} disablePadding>
                <Box
                  component={Link}
                  flex={1}
                  to={item.path}
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={onClose}
                >
                  <ListItemButton selected={active}>
                    {item.icon && (
                      <ListItemIcon>
                        <SvgIcon>{item.icon}</SvgIcon>
                      </ListItemIcon>
                    )}
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        anchor="left"
        open
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      sx={{
        zIndex: (theme: any) => theme.zIndex.appBar + 100,
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

export default Sidebar;
