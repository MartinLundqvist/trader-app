import { sequelize } from './index.js';
import { DataTypes, ModelDefined, Op, Optional } from 'sequelize';
import { Ticker, Tickers } from '../types/index.js';
import { tickersSchema } from '../schemas/index.js';

type TickerModelCreationAttributes = Optional<Ticker, 'id'>;

const TickerModel: ModelDefined<Ticker, TickerModelCreationAttributes> =
  sequelize.define(
    'TickerModel',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      market_cap: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      symbol: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      exchange: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      asset_type: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      price_currency: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: 'tickerdata_3500',
    }
  );

const createData = async (data: Tickers) => {
  try {
    const result = await TickerModel.bulkCreate(data);
    console.log(`${result.length} records created.`);
  } catch (err) {
    console.log(`Error while creating bulk data`);
    console.log(err);
  }
};

const findAllTickers = async (): Promise<string[]> => {
  let results: string[] = [];

  try {
    const result = await TickerModel.findAll({
      attributes: ['symbol'],
      order: [['market_cap', 'DESC']],
    });
    console.log(`${result.length} records found.`);
    results = result.map((r) => r.dataValues.symbol);
  } catch (err) {
    console.log(`Error while fetching data`);
    console.log(err);
  }

  return results;
};

const findTickersFrom = async (
  exchanges: string[],
  asset_types = ['']
): Promise<Tickers> => {
  let result: Tickers = [];
  let data: unknown[] = [];

  try {
    data = await TickerModel.findAll({
      where: {
        exchange: { [Op.or]: exchanges },
        asset_type: { [Op.or]: asset_types },
      },
    });
    console.log(`${data.length} records found.`);
  } catch (err) {
    console.log(`Error while fetching data for ${JSON.stringify(exchanges)}`);
    console.log(err);
  }
  try {
    result = tickersSchema.parse(data);
  } catch (err) {
    console.log(`Error while validating data`);
    console.log(err);
  }

  return result;
};

const findDataByTickers = async (tickers: string[]): Promise<Tickers> => {
  let result: Tickers = [];
  let data: unknown[] = [];

  try {
    data = await TickerModel.findAll({
      where: {
        symbol: { [Op.or]: tickers },
      },
    });
    console.log(`${data.length} records found.`);
  } catch (err) {
    console.log(`Error while fetching data for ${JSON.stringify(tickers)}`);
    console.log(err);
  }
  try {
    result = tickersSchema.parse(data);
  } catch (err) {
    console.log(`Error while validating data`);
    console.log(err);
  }

  return result;
};

const recreateTable = async () => {
  try {
    await TickerModel.sync({ force: true });
    console.log(`Table dropped and recreated.`);
  } catch (err) {
    console.log(`Error while recreating table`);
    console.log(err);
  }
};

// TODO: This doesn't work
// const getExchanges = async (asset_types = ['']): Promise<unknown[]> => {
//   // let result: string[] = [];
//   let data: unknown[] = [];

//   try {
//     data = await TickerModel.findAll({
//       attributes: ['DISTINCT', ' TickerModel.exchange'],
//       where: {
//         asset_type: { [Op.or]: asset_types },
//       },
//     });
//     console.log(`${data.length} records found.`);
//   } catch (err) {
//     console.log(`Error while fetching data for ${JSON.stringify(asset_types)}`);
//     console.log(err);
//   }
// try {
//   // result = tickersSchema.parse(data);
// } catch (err) {
//   console.log(`Error while validating data`);
//   console.log(err);
// }

//   return data;
// };

const TickerDB = {
  createData,
  findTickersFrom,
  findDataByTickers,
  recreateTable,
  findAllTickers,
  // getExchanges,
};

export default TickerDB;
