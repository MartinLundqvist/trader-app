import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import IFrame from './components/IFrame';

const drawerWidth = 240;

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position='absolute'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography component='h1' variant='h6' noWrap sx={{ flexGrow: 1 }}>
            Trader Bot
          </Typography>
        </Toolbar>
        <Box>
          <Toolbar>
            <IconButton>Test</IconButton>
          </Toolbar>
        </Box>
      </AppBar>
    </Box>
  );
}

export default App;
