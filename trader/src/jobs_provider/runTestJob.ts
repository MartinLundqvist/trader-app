import { Job } from '../types/index.js';
import { sleep } from '../utils/index.js';

export const runTestJob = async (job: Job) => {
  console.log('Running test job...');
  job.status = 'running';
  await sleep(3000);
  job.status = 'completed';
  job.message = 'Test job completed successfully.';
};
