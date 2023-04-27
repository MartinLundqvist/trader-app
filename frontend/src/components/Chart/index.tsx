import ReactEChart from 'echarts-for-react';
import { EChartsOption } from 'echarts-for-react';
import { useRef } from 'react';
import { createOption } from './createOption';

const Chart = (): JSX.Element => {
  const option = createOption();

  return (
    <ReactEChart style={{ width: '100%', height: '600px' }} option={option} />
  );
};

export default Chart;
