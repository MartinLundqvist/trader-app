import ReactEChart from 'echarts-for-react';
import { ECElementEvent } from 'echarts';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STOP_LOSS_LINE, TAKE_PROFIT_LINE, createOption } from './createOption';
import { useTickerSignals } from '../../hooks/useTickerSignals';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { TraderPaper } from '../../elements';
import { useTrades } from '../../contexts/TradesContext';
import { useParams } from 'react-router-dom';
import { Trade } from '@trader/types';
import { useOrders } from '../../hooks/useOrders';
import { findFilledOrders } from '../../utils';

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
  const [startZoom, setStartZoom] = useState<number>(0);
  const [endZoom, setEndZoom] = useState<number>(100);
  const chartRef = useRef<ReactEChart>(null);
  const { ticker } = useParams();
  const { tickerSignals, isLoading, error } = useTickerSignals();

  const { currentTrade, setCurrentTrade } = useTrades();

  const { orders } = useOrders();

  const isDragging = useRef<string>('');

  const handleCurrentTradeChange = (key: keyof Trade, value: any) => {
    if (!currentTrade) return;
    setCurrentTrade((prev) => ({ ...prev, [key]: value }));
  };

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
      if (instance.getZr()) {
        instance.getZr().off('mousemove', handleMouseMove);
        instance.getZr().off('mouseup', handleMouseUp);
      }
      if (instance) {
        instance.off('mousedown', handleMouseDown);
        instance.off('datazoom', handleDataZoom);
      }
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

  const updatePosition = (LINE: string, event: ECElementEvent) => {
    if (!chartRef.current) return;
    const offsetY = event.event?.offsetY;
    if (offsetY === undefined || offsetY < 0) return;

    const instance = chartRef.current.getEchartsInstance();
    const [_, newValue] = instance.convertFromPixel('grid', [0, offsetY]);

    if (LINE === TAKE_PROFIT_LINE) {
      handleCurrentTradeChange(
        'take_profit',
        Number(Number(newValue).toFixed(2))
      );
    }
    if (LINE === STOP_LOSS_LINE) {
      handleCurrentTradeChange(
        'stop_loss',
        Number(Number(newValue).toFixed(2))
      );
    }
  };

  const chartOption = useMemo(() => {
    if (!tickerSignals) return null;
    const filledOrders = findFilledOrders(orders || [], ticker || '');
    return createOption(
      tickerSignals,
      currentTrade?.stop_loss || 0,
      currentTrade?.take_profit || 0,
      startZoom,
      endZoom,
      filledOrders
    );
  }, [tickerSignals, currentTrade, startZoom, endZoom]);

  if (!ticker || ticker === '')
    return <Alert severity='info'>Select a ticker</Alert>;

  if (isLoading) return <CircularProgress />;

  if (error) return <Alert severity='error'>Error: {error.message}</Alert>;

  if (!tickerSignals)
    return <Alert severity='error'>No data found for {ticker}</Alert>;

  // console.log(
  //   createOption(
  //     tickerSignals,
  //     currentTrade?.stop_loss || 0,
  //     currentTrade?.take_profit || 0,
  //     startZoom,
  //     endZoom
  //   )
  // );

  return (
    <TraderPaper sx={{ height: '500px' }}>
      <Box gap={2} height='100%'>
        <Typography>Candlesticks and signals for {ticker}</Typography>

        <ReactEChart
          ref={chartRef}
          style={{ width: '100%', height: '100%' }}
          option={chartOption}
        />
      </Box>
    </TraderPaper>
  );
};

export default Chart;
