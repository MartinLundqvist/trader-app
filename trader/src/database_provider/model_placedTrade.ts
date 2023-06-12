import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { PlacedTrade, PlacedTrades } from '../types/index.js';
import { sequelize } from './index.js';
import { placedTradeSchema, placedTradesSchema } from '../schemas/index.js';

type PlacedTradeModelCreationAttributes = Optional<PlacedTrade, 'id'>;

const PlacedTradeModel: ModelDefined<
  PlacedTrade,
  PlacedTradeModelCreationAttributes
> = sequelize.define(
  'PlacedTradeModel',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    strategy: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    symbol: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    side: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    qty: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stop_loss: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    take_profit: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    limit: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    client_id: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    job_id: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    error: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  },
  {
    tableName: 'placed_trades',
  }
);

const createData = async (data: PlacedTrades) => {
  try {
    const result = await PlacedTradeModel.bulkCreate(data);
    console.log(`${result.length} records created.`);
  } catch (err) {
    console.log('Error while creating records');
    console.log(err);
  }
};

const findAllTrades = async (): Promise<PlacedTrades> => {
  let data: unknown[] = [];
  let results: PlacedTrades = [];

  try {
    data = await PlacedTradeModel.findAll();
    console.log(`${data.length} records found.`);
  } catch (err) {
    console.log('Error while fetching placed trades');
    console.log(err);
  }

  try {
    results = placedTradesSchema.parse(data);
  } catch (err) {
    console.log('Error while validating placed trades');
    console.log(err);
  }

  return results;
};

const findTradesByJobId = async (jobId: string): Promise<PlacedTrades> => {
  let data: unknown[] = [];
  let results: PlacedTrades = [];

  try {
    data = await PlacedTradeModel.findAll({
      where: {
        job_id: jobId,
      },
    });
    console.log(`${data.length} records found.`);
  } catch (err) {
    console.log(`Error while fetching placed trades with job id ${jobId}`);
    console.log(err);
  }

  try {
    results = placedTradesSchema.parse(data);
  } catch (err) {
    console.log('Error while validating placed trades');
    console.log(err);
  }

  return results;
};

const findTradeByClientId = async (
  clientId: string
): Promise<PlacedTrade | null> => {
  let data: unknown;
  let result: PlacedTrade | null = null;

  try {
    data = await PlacedTradeModel.findOne({
      where: {
        client_id: clientId,
      },
    });
    console.log(`Record found.`);
  } catch (err) {
    console.log(`Error while fetching placed trade with client id ${clientId}`);
    console.log(err);
  }

  try {
    result = placedTradeSchema.parse(data);
  } catch (err) {
    console.log('Error while validating placed trades');
    console.log(err);
  }

  return result;
};

const recreateTable = async () => {
  try {
    await PlacedTradeModel.sync({ force: true });
    console.log(`Table dropped and recreated.`);
  } catch (err) {
    console.log(`Error while recreating table`);
    console.log(err);
  }
};

const PlacedTradesDB = {
  createData,
  findAllTrades,
  findTradesByJobId,
  findTradeByClientId,
  recreateTable,
};

export default PlacedTradesDB;
