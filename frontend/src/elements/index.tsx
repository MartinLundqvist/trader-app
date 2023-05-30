import {
  Card,
  Paper,
  PaperTypeMap,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import { ReactNode } from 'react';

const TraderPaperStyled = styled(Paper)`
  padding: ${(props) => props.theme.spacing(2)};
`;

export const TraderPaper = ({ children, ...props }: PaperTypeMap['props']) => {
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

export const TraderHeader = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => {
  return (
    <>
      <Toolbar disableGutters>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {children}
      </Toolbar>
    </>
  );
};
