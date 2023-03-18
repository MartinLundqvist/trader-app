import dotenv from 'dotenv';
dotenv.config();

// https://api.tiingo.com/tiingo/daily/<ticker>/prices?startDate=2012-1-1&endDate=2016-1-1&format=csv&resampleFreq=monthly
// https://api.tiingo.com/tiingo/fundamentals/<ticker>/daily?token=xxx&startDate=2023-03-16

export const BASE_URL = 'https://api.tiingo.com/tiingo';
export const DAILY_URL = BASE_URL + '/daily';
export const FUNDAMENTALS_URL = BASE_URL + '/fundamentals';
export const END_POINT_EOD = 'prices';
export const END_POINT_DAILY = 'daily';
export const AUTHORIZATION = 'token=' + process.env.API_KEY_TIINGO;
