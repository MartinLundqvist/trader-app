import { Card, Paper, styled } from '@mui/material';
import { ReactNode } from 'react';

const TraderPaperStyled = styled(Paper)`
  padding: 1rem;
`;

export const TraderPaper = ({
  children,
  ...props
}: {
  children: ReactNode;
}) => {
  return (
    <TraderPaperStyled elevation={3} {...props}>
      {children}
    </TraderPaperStyled>
  );
};

export const TraderCard = ({ children, ...props }: { children: ReactNode }) => {
  return (
    <Card elevation={3} {...props}>
      {children}
    </Card>
  );
};
