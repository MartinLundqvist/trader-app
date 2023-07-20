import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  css,
  styled,
  Theme,
} from '@mui/material';

import { useState } from 'react';
import { ChevronLeft, TrendingUpOutlined } from '@mui/icons-material';
import { useNavItems } from '../../hooks/useNavItems';

const NAV_WIDTH_OPEN = '240px';
const NAV_WIDTH_CLOSED = '60px';

const openMixin = css`
  width: ${NAV_WIDTH_OPEN};
  transition: width
    ${(props: { theme: Theme }) =>
      props.theme.transitions.duration.enteringScreen}ms
    ${(props: { theme: Theme }) => props.theme.transitions.easing.sharp};
  overflow-x: hidden;
`;

const closedMixin = css`
  width: ${NAV_WIDTH_CLOSED};
  transition: width
    ${(props: { theme: Theme }) =>
      props.theme.transitions.duration.leavingScreen}ms
    ${(props: { theme: Theme }) => props.theme.transitions.easing.sharp};
  overflow-x: hidden;
`;

const StyledDrawer = styled(Drawer)<{ open: boolean }>`
  ${(props) => (props.open ? openMixin : closedMixin)}

  .MuiDrawer-paper {
    color: ${(props) => props.theme.palette.primary.contrastText};
    background-color: ${(props) => props.theme.palette.primary.main};
    ${(props) => (props.open ? openMixin : closedMixin)}
  }
`;

const Navigation = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  const NAV_ITEMS = useNavItems();

  return (
    <StyledDrawer
      open={open}
      anchor='left'
      variant='permanent'
      PaperProps={{ elevation: 10 }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <IconButton
            sx={{ padding: 0 }}
            color='inherit'
            onClick={() => setOpen(true)}
          >
            <TrendingUpOutlined />
          </IconButton>
          <Typography
            variant='h5'
            sx={{
              display: open ? 'inline' : 'none',
            }}
          >
            TRADER
          </Typography>
        </Box>
        <IconButton
          color='inherit'
          onClick={() => setOpen(false)}
          sx={{
            display: open ? 'inline' : 'none',
          }}
        >
          {open && <ChevronLeft />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem
            key={item.label}
            component={item.component}
            to={item.to}
            disablePadding
            sx={{ display: 'block', color: 'inherit', textWrap: 'nowrap' }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Navigation;
