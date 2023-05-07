import { sequelize } from './index.js';
import { DataTypes, ModelDefined, Optional } from 'sequelize';
import { Strategies, Strategy } from '../types/index.js';
import { strategiesSchema } from '../schemas/index.js';

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
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      description_short: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      description_long: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {
      tableName: 'strategies',
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

const findAllStrategies = async (): Promise<Strategies> => {
  let results: Strategies = [];
  let data: unknown[] = [];

  try {
    data = await StrategyModel.findAll({
      order: [['name', 'DESC']],
    });

    console.log(`${data.length} records found.`);
    // console.log(data);
  } catch (err) {
    console.log(`Error while fetching data`);
    console.log(err);
  }

  try {
    results = strategiesSchema.parse(data);
  } catch (err) {
    console.log(`Error while validating data`);
    console.log(err);
  }

  // console.log(results);

  return results;
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
  recreateTable,
};

export default StrategyDB;
