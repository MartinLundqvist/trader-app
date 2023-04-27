// import { EChartsOption } from 'echarts-for-react';
import { CandlestickSeriesOption, EChartsOption } from 'echarts';
import json from '../../development_assets/AAPL.json';
import { EventRounded } from '@mui/icons-material';

export const createOption = (): EChartsOption => {
  const upColor = '#00da3c';
  const downColor = '#ec0000';

  let categoryData = json.map((entry) => entry.date.split('T')[0]);

  let candlestickData = json.map((entry) => [
    entry.open,
    entry.close,
    entry.high,
    entry.low,
  ]);

  let bb_highData = json.map((entry) => entry.BB_high);
  let bb_lowData = json.map((entry) => entry.BB_low);
  let sma_slowData = json.map((entry) => entry.SMA_slow);
  let sma_fastData = json.map((entry) => entry.SMA_fast);
  let volumeData: any[] = [];

  for (let i = 0; i < json.length; i++) {
    volumeData.push([i, json[i].volume, json[i].close < json[i].open ? 1 : -1]);
  }

  let option: EChartsOption = {
    animation: false,
    legend: {
      bottom: 10,
      left: 'center',
      data: ['AAPL', 'BB Higher', 'BB Lower', 'Fast SMA', 'Slow SMA'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000',
      },
      position: (pos, params, el, elRect, size) => {
        const obj: Record<string, number> = {
          top: 10,
        };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
      label: {
        backgroundColor: '#777',
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false,
        },
        brush: {
          type: ['lineX', 'clear'],
        },
      },
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: downColor,
        },
        {
          value: -1,
          color: upColor,
        },
      ],
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '50%',
      },
      {
        left: '10%',
        right: '8%',
        top: '63%',
        height: '16%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100,
        },
      },
      {
        type: 'category',
        gridIndex: 1,
        data: categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: 'dataMin',
        max: 'dataMax',
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 0,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: 'AAPL',
        type: 'candlestick',
        data: candlestickData,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
        tooltip: {
          formatter: (param: any) => {
            param = param[0];
            return [
              'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
              'Open: ' + param.data[0] + '<br/>',
              'High: ' + param.data[1] + '<br/>',
              'Low: ' + param.data[2] + '<br/>',
              'Close: ' + param.data[3] + '<br/>',
            ].join('');
          },
        },
      },
      {
        name: 'BB Higher',
        type: 'line',
        data: bb_highData as any[],
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'BB Lower',
        type: 'line',
        data: bb_lowData as any[],
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'Slow SMA',
        type: 'line',
        data: sma_slowData as any[],
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'Fast SMA',
        type: 'line',
        data: sma_fastData as any[],
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumeData as any[],
      },
    ],
  };

  return option;
};
