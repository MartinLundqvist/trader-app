import {
  Button,
  ButtonProps,
  Card,
  CircularProgressProps,
  Paper,
  PaperTypeMap,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import { ReactNode } from 'react';
import { CircularProgressWithLabel } from './CircularProgressWithLabel';

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
        <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {children}
      </Toolbar>
    </>
  );
};

export const ButtonWithProgress = (
  props: CircularProgressProps & ButtonProps & { value: number }
) => {
  return (
    <Button
      variant='contained'
      disabled
      endIcon={<CircularProgressWithLabel size={20} value={props.value} />}
    >
      {props.children}
    </Button>
  );
};

export * from './CircularProgressWithLabel';
