import styled from 'styled-components';

const Container = styled.div`
  height: 50rem;

  iframe {
    border: 0;
    width: 100%;
    height: 100%;
  }
`;

const IFrame = ({ src }: { src: string }) => {
  return (
    <Container>
      <iframe src={src} />
    </Container>
  );
};

export default IFrame;
