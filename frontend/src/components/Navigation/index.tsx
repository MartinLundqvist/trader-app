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
} from '@mui/material';

import { useState } from 'react';
import { ChevronLeft, TrendingUpOutlined } from '@mui/icons-material';
import { useNavItems } from '../../hooks/useNavItems';

const NAV_WIDTH_OPEN = '240px';
const NAV_WIDTH_CLOSED = '60px';

const openMixin = css`
  width: ${NAV_WIDTH_OPEN};
  transition: width
    ${(props) => props.theme.transitions.duration.enteringScreen}ms
    ${(props) => props.theme.transitions.easing.sharp};
  overflow-x: hidden;
`;

const closedMixin = css`
  width: ${NAV_WIDTH_CLOSED};
  transition: width
    ${(props) => props.theme.transitions.duration.leavingScreen}ms
    ${(props) => props.theme.transitions.easing.sharp};
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
            sx={{ display: 'block', color: 'inherit' }}
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

// import { Tab, Tabs } from '@mui/material';
// import { useTrades } from '../../contexts/TradesContext';
// import { NavLink, matchPath, useLocation } from 'react-router-dom';

// const useRouteMatch = (patterns: readonly string[]) => {
//   const { pathname } = useLocation();

//   for (let i = 0; i < patterns.length; i += 1) {
//     const pattern = patterns[i];
//     const possibleMatch = matchPath({ path: pattern, end: false }, pathname);
//     if (possibleMatch !== null) {
//       return possibleMatch;
//     }
//   }

//   return null;
// };

// const Navigation = (): JSX.Element => {
//   const { trades } = useTrades();
//   // You need to provide the routes in descendant order.
//   // This means that if you have nested routes like:
//   // users, users/new, users/edit.
//   // Then the order should be ['users/add', 'users/edit', 'users'].
//   const routeMatch = useRouteMatch(['/signals', '/strategies', '/trades']);
//   const currentTab = routeMatch?.pattern?.path;

//   return (
//     <Tabs value={currentTab}>
//       <Tab
//         label='Strategies'
//         value='/strategies'
//         to='/strategies'
//         component={NavLink}
//       />
//       <Tab label='Signals' value='/signals' to='/signals' component={NavLink} />
//       <Tab
//         label={`Trades (${trades.length})`}
//         value='/trades'
//         to='/trades'
//         component={NavLink}
//       />
//     </Tabs>
//   );
// };

// export default Navigation;
