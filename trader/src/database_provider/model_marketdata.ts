import { sequelize } from './index.js';
import { DataTypes, ModelDefined, Op, Optional } from 'sequelize';
import { MarketData, MarketDatum } from '../types/index.js';
import { marketDataSchema } from '../schemas/index.js';
import { z } from 'zod';

type MarketModelCreationAttributes = Optional<MarketDatum, 'id'>;

const MarketModel: ModelDefined<MarketDatum, MarketModelCreationAttributes> =
  sequelize.define(
    'MarketModel',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      symbol: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      open: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      high: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      low: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      close: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      adj_close: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      adj_high: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      adj_low: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      adj_open: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      volume: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      split_factor: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      date: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'marketdata_3500',
    }
  );

const createData = async (data: MarketData) => {
  try {
    const result = await MarketModel.bulkCreate(data, {
      ignoreDuplicates: true,
    });
    console.log(`${result.length} records created.`);
    console.log(`${data.length - result.length} records skipped.`);
  } catch (err) {
    console.log(`Error while creating bulk data`);
    console.log(err);
  }
};

const readData = async (
  tickers: string[],
  dateFrom: Date,
  dateTo: Date
): Promise<MarketData> => {
  let result: MarketData = [];
  let data: unknown[] = [];

  try {
    data = await MarketModel.findAll({
      where: {
        [Op.and]: [
          { date: { [Op.gte]: dateFrom } },
          { date: { [Op.lte]: dateTo } },
          { symbol: { [Op.or]: tickers } },
        ],
      },
    });
    console.log(`${data.length} records found.`);
  } catch (err) {
    console.log(`Error while fetching data for ${JSON.stringify(tickers)}`);
    console.log(err);
  }
  try {
    result = marketDataSchema.parse(data);
  } catch (err) {
    console.log(`Error while validating data`);
    console.log(err);
  }

  return result;
};

const recreateTable = async () => {
  try {
    await MarketModel.sync({ force: true });
    console.log(`Table dropped and recreated.`);
  } catch (err) {
    console.log(`Error while recreating table`);
    console.log(err);
  }
};

const getLatestDate = async (): Promise<Date> => {
  let date = new Date();

  const schema = z.coerce.date();

  try {
    const result = await MarketModel.max('date');
    date = schema.parse(result);
  } catch (err) {
    console.log(`Error while fetching latest date`);
    console.log(err);
  }

  console.log(`Latest date: ${date}`);

  return date;
};

const MarketDataDB = {
  createData,
  readData,
  recreateTable,
  getLatestDate,
};

export default MarketDataDB;
