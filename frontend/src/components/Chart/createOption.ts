// import { StrategyTickerData } from '@trader-app/shared';
import {
  EChartsOption,
  MarkAreaComponentOption,
  MarkPointComponentOption,
} from 'echarts';
// import { TickerSignal } from '../../hooks/useTickerSignals';
import { StrategyTickerData } from '@trader/types';
import { FilledOrder } from '../../utils';
export const STOP_LOSS_LINE = 'Stop Loss';
export const TAKE_PROFIT_LINE = 'Take Profit';

export const createOption = (
  data: StrategyTickerData,
  stopLoss = 0,
  takeProfit = 0,
  startZoom = 0,
  endZoom = 100,
  filledOrders: FilledOrder[] = []
): EChartsOption => {
  // console.log('createOption', stopLoss, takeProfit, startZoom, endZoom);

  const upColor = '#00da3c';
  const downColor = '#ec0000';

  let symbol = data[0].symbol;

  let categoryData = data.map(
    (entry) => entry.date.toISOString().split('T')[0]
  );

  let candlestickData = data.map((entry) => [
    entry.Open,
    entry.Close,
    entry.High,
    entry.Low,
  ]);

  // TODO: Refactor the below to be programmatically declared by the Strategy
  // TODO: Also move all these map methods into the below for-loop - this is a performance disaster
  let bb_highData = data.map((entry) => entry.BB_high);
  let bb_lowData = data.map((entry) => entry.BB_low);
  let sma_slowData = data.map((entry) => entry.SMA_slow);
  let sma_fastData = data.map((entry) => entry.SMA_fast);
  let volumeData: any[] = [];
  let signalMarkPoints: MarkPointComponentOption['data'] = [];

  for (let i = 0; i < data.length; i++) {
    volumeData.push([i, data[i].Volume, data[i].Close < data[i].Open ? 1 : -1]);
    if (data[i].Signal !== '') {
      signalMarkPoints.push({
        name: data[i].Signal,
        value: data[i].Signal,
        xAxis: data[i].date.toISOString().split('T')[0],
        yAxis: data[i].Close,
        symbolRotate: data[i].Signal === 'Buy' ? 180 : 0,
        symbol: 'pin',
        symbolSize: 40,
        itemStyle: {
          color: 'orange',
        },
        label: {
          show: true,
          position: data[i].Signal === 'Buy' ? 'insideBottom' : 'insideTop',
        },
      });
    }
  }

  for (let i = 0; i < filledOrders.length; i++) {
    signalMarkPoints.push({
      name: filledOrders[i].side,
      // value: filledOrders[i].side === 'buy' ? 'Long' : 'Short',
      value:
        (filledOrders[i].side === 'buy' ? 'Bought' : 'Sold') +
        ' at ' +
        filledOrders[i].price,
      xAxis: filledOrders[i].date.toISOString().split('T')[0],
      yAxis: filledOrders[i].price,
      symbol: 'triangle',
      symbolSize: 20,
      symbolOffset: filledOrders[i].side === 'buy' ? [0, 15] : [0, -15],
      symbolRotate: filledOrders[i].side === 'buy' ? 0 : 180,
      itemStyle: {
        color: 'black',
      },
      label: {
        show: false,
        position: filledOrders[i].side === 'buy' ? 'insideBottom' : 'insideTop',
        offset: [0, filledOrders[i].side === 'buy' ? 20 : -20],
        color: 'black',
      },
    });
  }

  // positionMarkAreas.push([
  //   {
  //     name: 'Testarea',
  //     xAxis: '2023-02-28',
  //   },
  //   {
  //     xAxis: '2023-04-19',
  //   },
  // ]);

  let option: EChartsOption = {
    animation: false,
    // title: {
    //   text: `Signals for ${symbol}`,
    // },
    legend: {
      bottom: 10,
      left: 'center',
      data: [symbol, 'BB Higher', 'BB Lower', 'Fast SMA', 'Slow SMA'],
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
        left: '5%',
        right: '15%',
        height: '50%',
      },
      {
        left: '5%',
        right: '15%',
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
        start: startZoom,
        end: endZoom,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '85%',
        start: startZoom,
        end: endZoom,
      },
    ],

    series: [
      {
        name: symbol, //TODO: Fix this
        type: 'candlestick',
        data: candlestickData,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
        markPoint: {
          data: signalMarkPoints,
        },
        markLine: {
          symbol: 'none', // Remove the default symbols at the end of the lines
          data: [
            {
              name: TAKE_PROFIT_LINE,

              yAxis: takeProfit, // Your take-profit value
              lineStyle: {
                color: 'green',
                width: 2,
                type: 'solid',
              },
              label: {
                formatter: 'TP: {c}',
                position: 'end',
                // fontSize: 14,
              },
            },
            {
              name: STOP_LOSS_LINE,
              yAxis: stopLoss, // Your stop-loss value
              lineStyle: {
                color: 'red',
                width: 2,
                type: 'solid',
              },
              label: {
                formatter: 'SL: {c}',
                position: 'end',
                // fontSize: 14,
              },
            },
          ],
        },
        // markArea: {
        //   name: 'Test',
        //   itemStyle: {
        //     color: 'rgba(255,0,0,0.1)',
        //   },
        //   data: positionMarkAreas,
        // },

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
        symbol: 'none',
        data: bb_highData as any[],
        smooth: true,
        color: 'black',
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'BB Lower',
        type: 'line',
        symbol: 'none',
        data: bb_lowData as any[],
        smooth: true,
        color: 'black',
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'Slow SMA',
        type: 'line',
        symbol: 'none',
        data: sma_slowData as any[],
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'Fast SMA',
        type: 'line',
        symbol: 'none',
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
