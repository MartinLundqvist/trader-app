import { Grid } from '@mui/material';
import Selectors from '../../components/Selectors';
import { Outlet } from 'react-router-dom';
import { TraderHeader } from '../../elements';

const Signals = (): JSX.Element => {
  return (
    <>
      <TraderHeader title='Assess buy/sell signals and place trades'>
        <Selectors />
      </TraderHeader>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};

export default Signals;
