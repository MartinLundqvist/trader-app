import ReactEChart from 'echarts-for-react';
import { ECElementEvent } from 'echarts';
import { useEffect, useRef, useState } from 'react';
import { STOP_LOSS_LINE, TAKE_PROFIT_LINE, createOption } from './createOption';
import { useTickerSignals } from '../../hooks/useTickerSignals';
import { Alert, CircularProgress } from '@mui/material';
import { useTrader } from '../../contexts/TraderContext';

interface ECDataZoomEvent {
  type: string;
  // percentage of zoom start position, 0 - 100
  start: number;
  // percentage of zoom finish position, 0 - 100
  end: number;
  // data value of zoom start position; only exists in zoom event of triggered by toolbar
  startValue: number;
  // data value of zoom finish position; only exists in zoom event of triggered by toolbar
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
  const { ticker, strategy } = useTrader();
  const { tickerSignals, isLoading, error } = useTickerSignals();

  let isDragging = '';

  useEffect(() => {
    // console.log('Rerendering....');
    if (!chartRef.current) return;

    const instance = chartRef.current.getEchartsInstance();

    // Need to use get the ZRenderer instance to get the mousemove event outside graphical elements
    instance.getZr().on('mousemove', (event: ECElementEvent) => {
      handleMouseMove(event);
    });

    // Here we use the default handler to get the mousedown event inside graphical elements
    // else we won't be able to get the name of the element
    instance.on('mousedown', (event: ECElementEvent) => handleMouseDown(event));
    instance
      .getZr()
      .on('mouseup', (event: ECElementEvent) => handleMouseUp(event));
    instance.on('datazoom', (event: unknown) =>
      handleDataZoom(event as ECDataZoomEvent)
    );

    return () => {
      if (instance && instance.getZr()) {
        instance.getZr().off('mousemove', handleMouseMove);
        instance.off('mousedown', handleMouseDown);
        instance.getZr().off('mouseup', handleMouseUp);
        instance.off('datazoom', handleDataZoom);
      }
    };
  }, []);

  const handleMouseDown = (event: ECElementEvent) => {
    if (event.name === TAKE_PROFIT_LINE || event.name === STOP_LOSS_LINE) {
      isDragging = event.name;
    }
  };

  const handleMouseUp = (event: ECElementEvent) => {
    isDragging = '';
  };

  const handleMouseMove = (event: ECElementEvent) => {
    if (isDragging === '') return;
    updatePosition(isDragging, event);
  };
  const handleDataZoom = (event: ECDataZoomEvent) => {
    // console.log(event);
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
      // console.log('Setting zoom', start, end);
      setStartZoom(start);
      setEndZoom(end);
    }
  };

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

  if (ticker === '') return <Alert severity='info'>Select a ticker</Alert>;

  if (isLoading) return <CircularProgress />;

  if (error) return <Alert severity='error'>Error: {error.message}</Alert>;

  if (!tickerSignals) return <Alert severity='warning'>No data found</Alert>;

  return (
    <ReactEChart
      ref={chartRef}
      style={{ width: '100%', height: '600px' }}
      option={createOption(
        tickerSignals,
        stopLoss,
        takeProfit,
        startZoom,
        endZoom
      )}
    />
  );
};

export default Chart;
