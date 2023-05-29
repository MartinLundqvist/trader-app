import { Tab, Tabs } from '@mui/material';
import { useTrades } from '../../contexts/TradesContext';
import { NavLink, matchPath, useLocation } from 'react-router-dom';

const useRouteMatch = (patterns: readonly string[]) => {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath({ path: pattern, end: false }, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
};

const Navigation = (): JSX.Element => {
  const { trades } = useTrades();
  // You need to provide the routes in descendant order.
  // This means that if you have nested routes like:
  // users, users/new, users/edit.
  // Then the order should be ['users/add', 'users/edit', 'users'].
  const routeMatch = useRouteMatch(['/signals', '/strategies', '/trades']);
  const currentTab = routeMatch?.pattern?.path;

  return (
    <Tabs value={currentTab}>
      <Tab
        label='Strategies'
        value='/strategies'
        to='/strategies'
        component={NavLink}
      />
      <Tab label='Signals' value='/signals' to='/signals' component={NavLink} />
      <Tab
        label={`Trades (${trades.length})`}
        value='/trades'
        to='/trades'
        component={NavLink}
      />
    </Tabs>
  );
};

export default Navigation;
