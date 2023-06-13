import { nanoid } from 'nanoid';
import { PlaceOrder } from '../broker_provider/alpaca/index.js';
import Trader from '../broker_provider/index.js';
import { Job, PlacedTrades, Trades } from '../types/index.js';
import PlacedTradesDB from '../database_provider/model_placedTrade.js';

export const runPlaceOrders = async (job: Job) => {
  if (!job.trades || job.trades.length === 0) {
    job.status = 'failed';
    job.message = 'No trades to place';
    return;
  }

  job.status = 'running';
  job.progress = 0;

  const job_id = nanoid();
  const placed_at = new Date();

  const successfulOrders: PlacedTrades = [];
  const failedOrders: PlacedTrades = [];

  // const tradesToPlace: PlaceOrder[] = [];

  // for (let trade of job.trades) {
  //   const { symbol, side, qty, stop_loss, take_profit } = trade;
  //   const client_id = nanoid();

  //   tradesToPlace.push({
  //     client_order_id: client_id,
  //     symbol,
  //     side,
  //     qty,
  //     type: 'market',
  //     time_in_force: 'gtc',
  //     order_class: 'bracket',
  //     stop_loss: {
  //       stop_price: stop_loss,
  //     },
  //     take_profit: {
  //       limit_price: take_profit,
  //     },
  //   });
  // }

  job.message = 'Orders placed for: ';

  for (let trade of job.trades) {
    const { symbol, side, qty, stop_loss, take_profit } = trade;
    const client_id = nanoid();

    const tradeToPlace: PlaceOrder = {
      client_order_id: client_id,
      symbol,
      side,
      qty,
      type: 'market',
      time_in_force: 'gtc',
      order_class: 'bracket',
      stop_loss: {
        stop_price: stop_loss,
      },
      take_profit: {
        limit_price: take_profit,
      },
    };

    try {
      const order = await Trader.placeOrder(tradeToPlace);

      successfulOrders.push({
        ...trade,
        placed_at,
        client_id,
        job_id,
        status: 'successful',
        error: '',
      });
    } catch (err: any) {
      if ('code' in err && 'message' in err) {
        console.log(err.code, err.message);
        failedOrders.push({
          ...trade,
          placed_at,
          client_id,
          job_id,
          status: 'failed',
          error: err.message,
        });
      } else {
        console.log('Error while placing trades');
      }
    } finally {
      job.progress += 1 / job.trades.length;
    }
  }

  // for (let trade of tradesToPlace) {
  //   try {
  //     const order = await Trader.placeOrder(trade);

  //     successfulOrders.push(order);
  //   } catch (err: any) {
  //     if ('code' in err && 'message' in err) {
  //       console.log(err.code, err.message);
  //       failedOrders.push(trade);
  //     } else {
  //       console.log('Error while placing trades');
  //     }
  //   } finally {
  //     job.progress += 1 / tradesToPlace.length;
  //   }
  // }

  await PlacedTradesDB.createData(successfulOrders);
  await PlacedTradesDB.createData(failedOrders);

  job.status = 'completed';
  job.message =
    'Orders placed for: ' +
    successfulOrders.map((order) => order.symbol).join(', ') +
    ' Failed orders: ' +
    failedOrders.map((order) => order.symbol).join(', ');
};

// let trades: Trades = [];
// const tradesToPlace: PlaceOrder[] = [];

// try {
//   trades = tradesSchema.parse(req.body);

//   for (let trade of trades) {
//     const { symbol, side, qty, stop_loss, take_profit } = trade;

//     tradesToPlace.push({
//       symbol: '3R3R3R',
//       side,
//       qty,
//       type: 'market',
//       time_in_force: 'gtc',
//       order_class: 'bracket',
//       stop_loss: {
//         stop_price: stop_loss,
//       },
//       take_profit: {
//         limit_price: take_profit,
//       },
//     });
//   }

//   console.log(JSON.stringify(tradesToPlace, null, 2));
// } catch (err) {
//   console.log(err);
//   res.status(500).send({ error: 'Error parsing trades' });
// }

// try {
//   for (let trade of tradesToPlace) {
//     const order = await Trader.placeOrder(trade);
//     console.log(JSON.stringify(order, null, 2));
//   }

//   let successfulTrades = [...trades].slice(0, 1);
//   let failedTrades = [...trades].slice(1, 2).map((trade) => ({
//     trade,
//     error: 'Not enough cash!',
//   }));

//   let response: PlaceTradesResponse = {
//     successful_trades: successfulTrades,
//     unsuccessful_trades: failedTrades,
//   };

//   res.status(200).send(response);
// } catch (err: any) {
//   console.log(err);
//   if ('code' in err && 'message' in err) {
//     console.log(err.code, err.message);
//     res.status(500).send({ error: err.message });
//   } else {
//     res.status(500).send({ error: 'Error while placing trades' });
//   }
// }
