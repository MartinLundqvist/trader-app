import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config();

const DB = process.env.URL_POSTGRES ?? '';

const sequelize = new Sequelize(DB, {
  dialect: 'postgres',
  protocol: 'postgres',
  //   dialectOptions: {
  //     ssl: {
  //       require: false,
  //       rejectUnauthorized: false,
  //     },
  //   },
});

// sequelize
//   .sync()
//   .then(() => {
//     console.log('Database & tables created!');
//   })
//   .catch((err) => {
//     console.log('Error creating database & tables: ', err);
//   });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
