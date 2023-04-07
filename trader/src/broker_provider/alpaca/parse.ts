import {
  Account,
  RawAccount,
  AccountStatus,
  RawOrder,
  OrderType,
  OrderSide,
  Order,
  OrderTimeInForce,
  OrderStatus,
  RawPosition,
  Position,
  PositionSide,
  RawTradeActivity,
  TradeActivity,
  TradeActivitySide,
  TradeActivityType,
  RawNonTradeActivity,
  NonTradeActivity,
  RawActivity,
  Activity,
  RawClock,
  Clock,
  RawOrderCancelation,
  OrderCancelation,
  PageOfTrades,
  RawPageOfTrades,
  PageOfQuotes,
  RawPageOfQuotes,
  RawPageOfBars,
  PageOfBars,
  Snapshot,
  RawSnapshot,
  TradeUpdate,
  RawTradeUpdate,
  RawLatestTrade,
  LatestTrade,
  RawPageOfMultiBars,
  PageOfMultiBars,
  MultiBar,
  RawAnnouncement,
  Announcement,
  CorporateActionSubType,
} from './entities.js';
import { CorporateAction } from './params.js';

function account(rawAccount: RawAccount): Account | undefined {
  if (!rawAccount) {
    return undefined;
  }

  try {
    return {
      ...rawAccount,
      raw: () => rawAccount,
      buying_power: Number(rawAccount.buying_power),
      regt_buying_power: Number(rawAccount.regt_buying_power),
      daytrading_buying_power: Number(rawAccount.daytrading_buying_power),
      cash: Number(rawAccount.cash),
      created_at: new Date(rawAccount.created_at),
      portfolio_value: Number(rawAccount.portfolio_value),
      multiplier: Number(rawAccount.multiplier),
      equity: Number(rawAccount.equity),
      last_equity: Number(rawAccount.last_equity),
      long_market_value: Number(rawAccount.long_market_value),
      short_market_value: Number(rawAccount.short_market_value),
      initial_margin: Number(rawAccount.initial_margin),
      maintenance_margin: Number(rawAccount.maintenance_margin),
      last_maintenance_margin: Number(rawAccount.last_maintenance_margin),
      sma: Number(rawAccount.sma),
      status: rawAccount.status as AccountStatus,
    };
  } catch (err) {
    throw new Error(`Account parsing failed. ${err}`);
  }
}

function clock(rawClock: RawClock): Clock | undefined {
  if (!rawClock) {
    return undefined;
  }

  try {
    return {
      raw: () => rawClock,
      timestamp: new Date(rawClock.timestamp),
      is_open: rawClock.is_open,
      next_open: new Date(rawClock.next_open),
      next_close: new Date(rawClock.next_close),
    };
  } catch (err) {
    throw new Error(`Order parsing failed. ${err}`);
  }
}

function latestTrade(raw: RawLatestTrade): LatestTrade | undefined {
  if (!raw) {
    return undefined;
  }

  try {
    return {
      ...raw,
      raw: () => raw,
      trade: {
        ...raw.trade,
        t: new Date(raw.trade.t),
      },
    };
  } catch (err) {
    throw new Error(`Latest trade parsing failed. ${err}`);
  }
}

function order(rawOrder: RawOrder): Order | undefined {
  if (!rawOrder) {
    return undefined;
  }

  try {
    return {
      ...rawOrder,
      raw: () => rawOrder,
      created_at: new Date(rawOrder.created_at),
      updated_at: new Date(rawOrder.updated_at),
      submitted_at: new Date(rawOrder.submitted_at),
      filled_at: new Date(rawOrder.filled_at),
      expired_at: new Date(rawOrder.expired_at),
      canceled_at: new Date(rawOrder.canceled_at),
      failed_at: new Date(rawOrder.failed_at),
      replaced_at: new Date(rawOrder.replaced_at),
      qty: Number(rawOrder.qty),
      filled_qty: Number(rawOrder.filled_qty),
      type: rawOrder.type as OrderType,
      side: rawOrder.side as OrderSide,
      time_in_force: rawOrder.time_in_force as OrderTimeInForce,
      limit_price: Number(rawOrder.limit_price),
      stop_price: Number(rawOrder.stop_price),
      filled_avg_price: Number(rawOrder.filled_avg_price),
      status: rawOrder.status as OrderStatus,
      legs: orders(rawOrder.legs) || [],
      trail_price: Number(rawOrder.trail_price),
      trail_percent: Number(rawOrder.trail_percent),
      hwm: Number(rawOrder.hwm),
      order_class: rawOrder.order_class,
    };
  } catch (err) {
    throw new Error(`Order parsing failed. ${err}`);
  }
}

function orders(rawOrders: RawOrder[]): Order[] | undefined {
  if (!rawOrders) return undefined;

  return rawOrders.map((value) => order(value) as Order);
}

function canceled_order(
  input: RawOrderCancelation
): OrderCancelation | undefined {
  if (!input) {
    return undefined;
  }

  // we don't want this field anymore
  let { body: order, ...rest } = input;

  try {
    return {
      ...rest,
      order: {
        ...order,
        raw: () => order,
        created_at: new Date(order.created_at),
        updated_at: new Date(order.updated_at),
        submitted_at: new Date(order.submitted_at),
        filled_at: new Date(order.filled_at),
        expired_at: new Date(order.expired_at),
        canceled_at: new Date(order.canceled_at),
        failed_at: new Date(order.failed_at),
        replaced_at: new Date(order.replaced_at),
        qty: Number(order.qty),
        filled_qty: Number(order.filled_qty),
        type: order.type as OrderType,
        side: order.side as OrderSide,
        time_in_force: order.time_in_force as OrderTimeInForce,
        limit_price: Number(order.limit_price),
        stop_price: Number(order.stop_price),
        filled_avg_price: Number(order.filled_avg_price),
        status: order.status as OrderStatus,
        legs: orders(order.legs) || [],
        trail_price: Number(order.trail_price),
        trail_percent: Number(order.trail_percent),
        hwm: Number(order.hwm),
        order_class: order.order_class,
      },
    };
  } catch (err) {
    throw new Error(`Order parsing failed. ${err}`);
  }
}

function canceled_orders(
  rawOrderCancelations: RawOrderCancelation[]
): OrderCancelation[] | undefined {
  return rawOrderCancelations
    ? rawOrderCancelations.map(
        (value) => canceled_order(value) as OrderCancelation
      )
    : undefined;
}

function position(rawPosition: RawPosition): Position | undefined {
  if (!rawPosition) {
    return undefined;
  }

  try {
    return {
      ...rawPosition,
      raw: () => rawPosition,
      avg_entry_price: Number(rawPosition.avg_entry_price),
      qty: Number(rawPosition.qty),
      side: rawPosition.side as PositionSide,
      market_value: Number(rawPosition.market_value),
      cost_basis: Number(rawPosition.cost_basis),
      unrealized_pl: Number(rawPosition.unrealized_pl),
      unrealized_plpc: Number(rawPosition.unrealized_plpc),
      unrealized_intraday_pl: Number(rawPosition.unrealized_intraday_pl),
      unrealized_intraday_plpc: Number(rawPosition.unrealized_intraday_plpc),
      current_price: Number(rawPosition.current_price),
      lastday_price: Number(rawPosition.lastday_price),
      change_today: Number(rawPosition.change_today),
    };
  } catch (err) {
    throw new Error(`Position parsing failed. ${err}`);
  }
}

function positions(rawPositions: RawPosition[]): Position[] | undefined {
  return rawPositions
    ? rawPositions.map((pos) => position(pos) as Position)
    : undefined;
}

function tradeActivity(
  rawTradeActivity: RawTradeActivity
): TradeActivity | undefined {
  if (!rawTradeActivity) {
    return undefined;
  }

  try {
    return {
      ...rawTradeActivity,
      raw: () => rawTradeActivity,
      cum_qty: Number(rawTradeActivity.cum_qty),
      leaves_qty: Number(rawTradeActivity.leaves_qty),
      price: Number(rawTradeActivity.price),
      qty: Number(rawTradeActivity.qty),
      side: rawTradeActivity.side as TradeActivitySide,
      type: rawTradeActivity.type as TradeActivityType,
    };
  } catch (err) {
    throw new Error(`TradeActivity parsing failed. ${err}`);
  }
}

function nonTradeActivity(
  rawNonTradeActivity: RawNonTradeActivity
): NonTradeActivity | undefined {
  if (!rawNonTradeActivity) {
    return undefined;
  }

  try {
    return {
      ...rawNonTradeActivity,
      raw: () => rawNonTradeActivity,
      net_amount: Number(rawNonTradeActivity.net_amount),
      qty: Number(rawNonTradeActivity.qty),
      per_share_amount: Number(rawNonTradeActivity.per_share_amount),
    };
  } catch (err) {
    throw new Error(`NonTradeActivity parsing failed. ${err}`);
  }
}

function activities(
  rawActivities: Array<RawActivity>
): Array<Activity | undefined> | undefined {
  if (!rawActivities) {
    return undefined;
  }

  try {
    return rawActivities.map((rawActivity) =>
      rawActivity.activity_type === 'FILL'
        ? tradeActivity(rawActivity)
        : nonTradeActivity(rawActivity)
    );
  } catch (err) {
    throw new Error(`Activity parsing failed. ${err}`);
  }
}

function pageOfTrades(page: RawPageOfTrades): PageOfTrades | undefined {
  if (!page) {
    return undefined;
  }

  try {
    return {
      raw: () => page,
      trades: (page.trades == null ? [] : page.trades).map((trade) => ({
        raw: () => trade,
        ...trade,
        t: new Date(trade.t),
      })),
      symbol: page.symbol,
      next_page_token: page.next_page_token,
    };
  } catch (err) {
    throw new Error(`PageOfTrades parsing failed "${err}"`);
  }
}

function pageOfQuotes(page: RawPageOfQuotes): PageOfQuotes | undefined {
  if (!page) {
    return undefined;
  }

  try {
    return {
      raw: () => page,
      quotes: (page.quotes == null ? [] : page.quotes).map((quote) => ({
        raw: () => quote,
        ...quote,
        t: new Date(quote.t),
      })),
      symbol: page.symbol,
      next_page_token: page.next_page_token,
    };
  } catch (err) {
    throw new Error(`PageOfTrades parsing failed "${err}"`);
  }
}

function pageOfBars(page: RawPageOfBars): PageOfBars | undefined {
  if (!page) {
    return undefined;
  }

  try {
    return {
      raw: () => page,
      bars: (page.bars == null ? [] : page.bars).map((bar) => ({
        raw: () => bar,
        ...bar,
        t: new Date(bar.t),
      })),
      symbol: page.symbol,
      next_page_token: page.next_page_token,
    };
  } catch (err) {
    throw new Error(`PageOfTrades parsing failed "${err}"`);
  }
}
function pageOfMultiBars(
  page: RawPageOfMultiBars
): PageOfMultiBars | undefined {
  if (!page) {
    return undefined;
  }

  const bars: Record<string, MultiBar[]> = {};

  try {
    Object.keys(page.bars).forEach((symbol) => {
      bars[symbol] = page.bars[symbol].map((bar) => ({
        raw: () => bar,
        ...bar,
        t: new Date(bar.t),
      }));
    });

    return {
      raw: () => page,
      bars,
      next_page_token: page.next_page_token,
    };
  } catch (err) {
    throw new Error(`pageOfMultiBars parsing failed "${err}"`);
  }
}

function announcements(raw: RawAnnouncement[]): Announcement[] | undefined {
  if (!raw || raw.length === 0) {
    return undefined;
  }

  const result: Announcement[] = [];

  try {
    raw.forEach((announcement) => {
      result.push({
        ...announcement,
        raw: () => announcement,
        ca_type: announcement.ca_type as CorporateAction,
        ca_sub_type: announcement.ca_sub_type as CorporateActionSubType,
        declaration_date: announcement.declaration_date
          ? new Date(announcement.declaration_date)
          : null,
        effective_date: new Date(announcement.effective_date),
        record_date: new Date(announcement.record_date),
        payable_date: new Date(announcement.payable_date),
        ex_date: new Date(announcement.ex_date),
        cash: Number(announcement.cash),
        old_rate: Number(announcement.old_rate),
        new_rate: Number(announcement.new_rate),
      });
    });
    return result;
  } catch (err) {
    throw new Error(`Announcement parsing failed "${err}"`);
  }
}

function snapshot(raw: RawSnapshot): Snapshot | undefined {
  if (!raw) {
    return undefined;
  }

  try {
    return {
      ...raw,
      raw: () => raw,
      latestTrade: raw.latestTrade
        ? {
            ...raw.latestTrade,
            t: new Date(raw.latestTrade.t),
          }
        : null,
      latestQuote: raw.latestQuote
        ? {
            ...raw.latestQuote,
            t: new Date(raw.latestQuote.t),
          }
        : null,
      minuteBar: raw.minuteBar
        ? {
            ...raw.minuteBar,
            t: new Date(raw.minuteBar.t),
          }
        : null,
      dailyBar: raw.dailyBar
        ? {
            ...raw.dailyBar,
            t: new Date(raw.dailyBar.t),
          }
        : null,
      prevDailyBar: raw.prevDailyBar
        ? {
            ...raw.prevDailyBar,
            t: new Date(raw.prevDailyBar.t),
          }
        : null,
    } as any as Snapshot;
  } catch (err) {
    throw new Error(`Snapshot parsing failed "${err}"`);
  }
}

function snapshots(raw: { [key: string]: RawSnapshot }): {
  [key: string]: Snapshot;
} {
  let parsed: { [key: string]: Snapshot } = {};

  for (let [key, value] of Object.entries(raw)) {
    parsed[key] = snapshot(value)!;
  }

  return parsed;
}

// function number(numStr: string | any): number | null {
//   if (typeof numStr === 'undefined' || numStr == null) {
//     return numStr;
//   }

//   const value = parseFloat(numStr);

//   if (Number.isNaN(value)) {
//     return null;
//   }

//   return value;
// }

function trade_update(rawTradeUpdate: RawTradeUpdate): TradeUpdate | undefined {
  if (!rawTradeUpdate) return undefined;

  return {
    raw: () => rawTradeUpdate,
    event: rawTradeUpdate.event,
    execution_id: rawTradeUpdate.execution_id,
    order: order(rawTradeUpdate.order) as Order,

    /* Only include the non-obligatory fields if they exist */
    ...(rawTradeUpdate.event_id && {
      event_id: Number(rawTradeUpdate.event_id),
    }),
    ...(rawTradeUpdate.at && { at: new Date(rawTradeUpdate.at) }),
    ...(rawTradeUpdate.timestamp && {
      timestamp: new Date(rawTradeUpdate.timestamp),
    }),
    ...(rawTradeUpdate.position_qty && {
      position_qty: Number(rawTradeUpdate.position_qty),
    }),
    ...(rawTradeUpdate.price && { price: Number(rawTradeUpdate.price) }),
    ...(rawTradeUpdate.qty && { qty: Number(rawTradeUpdate.qty) }),
  };
}

export default {
  account,
  activities,
  clock,
  nonTradeActivity,
  order,
  orders,
  canceled_orders,
  position,
  positions,
  tradeActivity,
  pageOfTrades,
  pageOfQuotes,
  pageOfBars,
  pageOfMultiBars,
  snapshot,
  snapshots,
  trade_update,
  latestTrade,
  announcements,
};
