import dotenv from 'dotenv';
dotenv.config();

// https://api.tiingo.com/tiingo/daily/<ticker>/prices?startDate=2012-1-1&endDate=2016-1-1&format=csv&resampleFreq=monthly

export const BASE_URL = 'https://api.tiingo.com/tiingo/daily';
export const END_POINT_EOD = 'prices';
export const AUTHORIZATION = 'token=' + process.env.API_KEY_TIINGO;
