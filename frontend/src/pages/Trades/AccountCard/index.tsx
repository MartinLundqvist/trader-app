import { Box, Typography } from '@mui/material';
import { TraderCard } from '../../../elements';

export const AccountCard = ({
  caption,
  value,
}: {
  caption: string;
  value: string;
}): JSX.Element => {
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
