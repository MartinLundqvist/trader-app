import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const App = (): JSX.Element => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navigation />
      <Box component='main' sx={{ flexGrow: 1, px: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default App;
