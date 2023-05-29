import { Grid } from '@mui/material';
import Selectors from '../../components/Selectors';
import { Outlet } from 'react-router-dom';

const Signals = (): JSX.Element => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Selectors />
      </Grid>
      <Grid item xs={10}>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default Signals;
