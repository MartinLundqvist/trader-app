import { Grid } from '@mui/material';
import Selectors from '../../components/Selectors';
import Strategy from '../../components/Strategy';
import Chart from '../../components/Chart';
import Trade from '../../components/Trade';

const Signals = (): JSX.Element => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={2}>
        <Selectors />
      </Grid>
      <Grid item xs={10}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Strategy />
          </Grid>
          <Grid item xs={8}>
            <Chart />
          </Grid>
          <Grid item xs={4}>
            <Trade />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Signals;
