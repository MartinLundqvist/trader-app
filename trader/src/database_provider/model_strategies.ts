import { sequelize } from './index.js';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { Strategies, Strategy } from '../types/index.js';
import { strategiesSchema } from '../schemas/index.js';
import { z } from 'zod';

type StrategyModelCreationAttributes = Optional<Strategy, 'id'>;

const StrategyModel: ModelDefined<Strategy, StrategyModelCreationAttributes> =
  sequelize.define(
    'StrategyModel',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      symbol: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      signal: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      limit: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      stop_loss: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      take_profit: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      tableName: 'strategyruns',
    }
  );

const createData = async (data: Strategies) => {
  try {
    const result = await StrategyModel.bulkCreate(data);
    console.log(`${result.length} records created.`);
  } catch (err) {
    console.log(`Error while creating bulk data`);
    console.log(err);
  }
};

const findAllStrategies = async (): Promise<string[]> => {
  let results: string[] = [];

  try {
    const data = await StrategyModel.findAll({
      attributes: ['name'],
      order: [['name', 'DESC']],
    });

    console.log(`${data.length} records found.`);

    results = Array.from(
      new Set(data.map((entry) => entry.getDataValue('name')))
    );
  } catch (err) {
    console.log(`Error while fetching data`);
    console.log(err);
  }

  return results;
};

const getLatestDate = async (): Promise<Date> => {
  let date = new Date();

  const schema = z.coerce.date();

  try {
    const result = await StrategyModel.max('date');
    date = schema.parse(result);
  } catch (err) {
    console.log(`Error while fetching latest date`);
    console.log(err);
  }

  console.log(`Latest date: ${date}`);

  return date;
};

const findLatestSignalsForStrategy = async (
  strategy: string
): Promise<Strategies> => {
  let result: Strategies = [];
  let data: unknown[] = [];

  const date = await getLatestDate();

  try {
    data = await StrategyModel.findAll({
      where: {
        name: strategy,
        date: date,
      },
    });
    console.log(`${data.length} records found.`);
  } catch (err) {
    console.log(`Error while fetching data for ${strategy}`);
    console.log(err);
  }

  try {
    result = strategiesSchema.parse(data);
  } catch (err) {
    console.log(`Error while validating data`);
    console.log(err);
  }

  return result;
};

const recreateTable = async () => {
  try {
    await StrategyModel.sync({ force: true });
    console.log(`Table dropped and recreated.`);
  } catch (err) {
    console.log(`Error while recreating table`);
    console.log(err);
  }
};

const StrategyDB = {
  createData,
  findAllStrategies,
  findLatestSignalsForStrategy,
  getLatestDate,
  recreateTable,
};

export default StrategyDB;
