import { Alert, Box, Divider, Typography } from '@mui/material';
import { TraderPaper } from '../../elements';
import { useParams } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';

const News = (): JSX.Element => {
  const { ticker } = useParams();
  const { news, isLoading, error } = useNews();

  // console.log(news);
  return (
    <TraderPaper sx={{ height: '300px' }}>
      <Box gap={2} height='100%' overflow='hidden'>
        <Typography variant='body1'>News for {ticker}</Typography>
        <Box height='100%' overflow='auto'>
          {isLoading && <Alert severity='info'>Loading...</Alert>}
          {error && <Alert severity='error'>Error: {error.message}</Alert>}
          {news?.map((n) => (
            <Box key={n.id} sx={{ padding: '10px' }}>
              <Typography variant='body2' fontWeight={800}>
                {n.publishedDate.toLocaleString()}:{n.title}
              </Typography>
              <Typography variant='body2'>{n.description}</Typography>
              <Typography variant='caption'>
                <a href={n.url} target='_blank'>
                  Link
                </a>
              </Typography>
              <Divider />
            </Box>
          ))}
        </Box>
      </Box>
    </TraderPaper>
  );
};

export default News;
