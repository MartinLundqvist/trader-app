import { Box } from '@mui/material';
import styled from 'styled-components';

// const Container = styled.div`
//   height: 40rem;

//   iframe {
//     border: 0;
//     width: 100%;
//     height: 100%;
//   }
// `;

const IFrame = ({ src }: { src: string }) => {
  return (
    <Box>
      {/* <iframe src={src} width='100%' height='100%' /> */}
      <iframe
        src='/src/development_assets/conservative_2023-04-16_AADI.html'
        width='100%'
        height='100%'
        style={{ border: 'none' }}
      />
    </Box>
  );
};

export default IFrame;
