// import {
//   StrategySignal,
//   StrategySignals,
// } from '@trader-app/shared/types/index.js';
// import {
//   StrategySignal,
//   StrategySignals,
//   strategySignalsSchema,
// } from '@trader-app/shared';
// import { StrategySignal, StrategySignals } from '@trader-app/shared';
import { sequelize } from './index.js';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
// import { Strategies, Strategy } from '../types/index.js';
// import { strategiesSchema } from '../schemas/index.js';
import { z } from 'zod';
import { StrategySignal, StrategySignals } from '../types/index.js';
import { strategySignalsSchema } from '../schemas/index.js';
// import { strategySignalsSchema } from '@trader-app/shared/src/schemas.js';
// import { strategySignalsSchema } from '@trader-app/shared';
// import { strategySignalsSchema } from '@trader-app/shared/src/schemas.js';
// import { strategySignalsSchema } from '@trader-app/shared/schemas/index.js';

type StrategySignalModelCreationAttributes = Optional<StrategySignal, 'id'>;

const StrategySignalModel: ModelDefined<
  StrategySignal,
  StrategySignalModelCreationAttributes
> = sequelize.define(
  'StrategySignalModel',
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
    strategy: {
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

const createData = async (data: StrategySignals) => {
  try {
    const result = await StrategySignalModel.bulkCreate(data);
    console.log(`${result.length} records created.`);
  } catch (err) {
    console.log(`Error while creating bulk data`);
    console.log(err);
  }
};

const findAllStrategies = async (): Promise<string[]> => {
  let results: string[] = [];

  try {
    const data = await StrategySignalModel.findAll({
      attributes: ['strategy'],
      order: [['name', 'DESC']],
    });

    console.log(`${data.length} records found.`);

    results = Array.from(
      new Set(data.map((entry) => entry.getDataValue('strategy')))
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
    const result = await StrategySignalModel.max('date');
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
): Promise<StrategySignals> => {
  let result: StrategySignals = [];
  let data: unknown[] = [];

  const date = await getLatestDate();

  try {
    data = await StrategySignalModel.findAll({
      where: {
        strategy: strategy,
        date: date,
      },
    });
    console.log(`${data.length} records found.`);
  } catch (err) {
    console.log(`Error while fetching data for ${strategy}`);
    console.log(err);
  }

  try {
    result = strategySignalsSchema.parse(data);
  } catch (err) {
    console.log(`Error while validating data`);
    console.log(err);
  }

  return result;
};

const recreateTable = async () => {
  try {
    await StrategySignalModel.sync({ force: true });
    console.log(`Table dropped and recreated.`);
  } catch (err) {
    console.log(`Error while recreating table`);
    console.log(err);
  }
};

const StrategySignalDB = {
  createData,
  findAllStrategies,
  findLatestSignalsForStrategy,
  getLatestDate,
  recreateTable,
};

export default StrategySignalDB;
