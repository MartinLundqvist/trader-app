import ReactEChart from 'echarts-for-react';
import { ECElementEvent } from 'echarts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { STOP_LOSS_LINE, TAKE_PROFIT_LINE, createOption } from './createOption';
import { useTickerSignals } from '../../hooks/useTickerSignals';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import { useTrader } from '../../contexts/TraderContext';
import { TraderPaper } from '../../elements';
import { useSignals } from '../../hooks/useSignals';
import { Trade } from '@trader/types';

interface ECDataZoomEvent {
  type: string;
  start: number;
  end: number;
  startValue: number;
  endValue: number;
  batch: {
    dataZoomId: string;
    start: number;
    end: number;
    type: string;
    startValue: number;
    endValue: number;
    animation: {
      easing: string;
      duration: number;
    };
    batch: null;
  }[];
}

const Chart = (): JSX.Element => {
  const [takeProfit, setTakeProfit] = useState<number>(160);
  const [stopLoss, setStopLoss] = useState<number>(150);
  const [startZoom, setStartZoom] = useState<number>(0);
  const [endZoom, setEndZoom] = useState<number>(100);
  const chartRef = useRef<ReactEChart>(null);
  const { ticker, setCurrentTrade } = useTrader();
  const { currentSignal } = useSignals();
  const { tickerSignals, isLoading, error } = useTickerSignals();

  const isDragging = useRef<string>('');

  const attachEventHandlers = useCallback((chart: ReactEChart) => {
    const instance = chart.getEchartsInstance();

    const handleMouseDown = (event: ECElementEvent) => {
      if (event.name === TAKE_PROFIT_LINE || event.name === STOP_LOSS_LINE) {
        isDragging.current = event.name;
      }
    };

    const handleMouseUp = (event: ECElementEvent) => {
      isDragging.current = '';
    };

    const handleMouseMove = (event: ECElementEvent) => {
      if (isDragging.current === '') return;
      updatePosition(isDragging.current, event);
    };

    const handleDataZoom = (event: ECDataZoomEvent) => {
      let start = 0;
      let end = 100;

      if (event.batch && event.batch[0].start !== undefined) {
        start = event.batch[0].start;
        end = event.batch[0].end;
      }

      if (event.batch && event.batch[0].startValue !== undefined) {
        start = event.batch[0].startValue;
        end = event.batch[0].endValue;
      }

      if (event.start !== undefined && event.end !== undefined) {
        start = event.start;
        end = event.end;
      }

      if (start !== undefined && end !== undefined) {
        setStartZoom(start);
        setEndZoom(end);
      }
    };

    // Need to use get the ZRenderer instance to get the mousemove and mouseup events outside graphical elements
    instance.getZr().on('mousemove', handleMouseMove);
    instance.getZr().on('mouseup', handleMouseUp);

    // Here we use the default handler to get the mousedown event inside graphical elements
    // else we won't be able to get the name of the element
    instance.on('mousedown', handleMouseDown);
    instance.on('datazoom', (event: unknown) =>
      handleDataZoom(event as ECDataZoomEvent)
    );

    return () => {
      console.log('Removing event handlers');
      instance.getZr().off('mousemove', handleMouseMove);
      instance.off('mousedown', handleMouseDown);
      instance.getZr().off('mouseup', handleMouseUp);
      instance.off('datazoom', handleDataZoom);
    };
  }, []);

  useEffect(() => {
    // This is an annyoing hack to get the chart ref upon first render

    let removeEventHandlers = () => {};

    const getRef = () => {
      if (!chartRef.current) {
        setTimeout(() => {
          getRef();
        }, 100);
      } else {
        removeEventHandlers = attachEventHandlers(chartRef.current);
      }
    };

    getRef();

    return () => {
      if (!chartRef.current) return;
      removeEventHandlers();
    };
  }, [ticker]);

  useEffect(() => {
    if (!currentSignal) return;

    setTakeProfit(currentSignal.take_profit || 0);
    setStopLoss(currentSignal.stop_loss || 0);
  }, [currentSignal]);

  const updatePosition = (LINE: string, event: ECElementEvent) => {
    if (!chartRef.current) return;
    const offsetY = event.event?.offsetY;
    if (offsetY === undefined || offsetY < 0) return;

    const instance = chartRef.current.getEchartsInstance();
    const [_, newValue] = instance.convertFromPixel('grid', [0, offsetY]);

    if (LINE === TAKE_PROFIT_LINE) {
      setTakeProfit(newValue);
    }
    if (LINE === STOP_LOSS_LINE) {
      setStopLoss(newValue);
    }
  };

  const handleUpdateTrade = () => {
    setCurrentTrade((prevTrade) => ({
      ...prevTrade,
      take_profit: { limit_price: takeProfit },
      stop_loss: { stop_price: stopLoss },
    }));
  };

  if (ticker === '') return <Alert severity='info'>Select a ticker</Alert>;

  if (isLoading) return <CircularProgress />;

  if (error) return <Alert severity='error'>Error: {error.message}</Alert>;

  if (!tickerSignals) return <Alert severity='warning'>No data found</Alert>;

  return (
    <TraderPaper>
      <Box gap={2}>
        <Typography>Candlesticks and signals for {ticker}</Typography>

        <ReactEChart
          ref={chartRef}
          style={{ width: '100%', minHeight: '450px' }}
          option={createOption(
            tickerSignals,
            stopLoss,
            takeProfit,
            startZoom,
            endZoom
          )}
        />
        <Divider />
        <Button
          variant='contained'
          sx={{ marginTop: '1rem' }}
          onClick={handleUpdateTrade}
        >
          Update Trade
        </Button>
      </Box>
    </TraderPaper>
  );
};

export default Chart;
