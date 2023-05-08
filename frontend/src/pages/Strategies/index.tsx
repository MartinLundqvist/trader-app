import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';

const Strategies = (): JSX.Element => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Typography color='HighlightText' gutterBottom>
                Marketdata
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' component='span'>
                  Last updated
                </Typography>
                <Chip label='2 days ago' color='primary' />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' component='span'>
                  # Tickers
                </Typography>
                <Chip label='3,505' color='primary' />
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <Button variant='contained'>Refresh data</Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Typography color='HighlightText' gutterBottom>
                Strategy: conservative
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' component='span'>
                  Last updated
                </Typography>
                <Chip label='2 days ago' color='primary' />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' component='span'>
                  # Signals
                </Typography>
                <Chip label='3,505' color='primary' />
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <Button variant='contained'>Refresh data</Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Strategies;
