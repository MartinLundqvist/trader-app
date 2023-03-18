import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const DB = process.env.URL_POSTGRES ?? '';

export const sequelize = new Sequelize(DB, {
  dialect: 'postgres',
  protocol: 'postgres',
});

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection with DB has been established successfully.');
  } catch (err) {
    console.error('Unable to connect to or sync with the database:', err);
  }
};

export const synchronizeDB = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('DB synchronized');
  } catch (err) {
    console.error('Unable to connect to or sync with the database:', err);
  }
};
