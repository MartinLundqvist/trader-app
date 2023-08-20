import { Box, Typography } from '@mui/material';
import { TraderCard } from '../../../elements';

// TODO: Need to test this error handler properly
export const AccountCard = ({
  caption,
  value,
  error = null,
}: {
  caption: string;
  value: string;
  error?: Error | null;
}): JSX.Element => {
  if (error) return <>{error.message}</>;

  return (
    <TraderCard>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1rem',
        }}
      >
        <Typography variant='caption'>{caption}</Typography>
        <Typography variant='body1'>{value}</Typography>
      </Box>
    </TraderCard>
  );
};
