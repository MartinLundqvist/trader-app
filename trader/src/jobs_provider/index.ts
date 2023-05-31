import { runRefreshStrategy } from './runRefreshStrategy.js';

const jobs = [
  {
    id: 'refresh-market-data',
    name: 'Refresh market data',
    status: 'idle',
    progress: 1,
    message: '',
  },
  {
    id: 'refresh-strategy',
    name: 'Refresh strategy',
    status: 'idle',
    progress: 1,
    message: '',
  },
];

export type Job = (typeof jobs)[0];

const jobQueue = [];

const workers = [
  {
    id: 'refresh-strategy',
    execute: (job: Job, strategy: string) => runRefreshStrategy(job, strategy),
  },
];

const startJobs = (interval: number) => {
  setInterval(() => {
    jobs.forEach((job) => {
      let status = job.status;
      job.status = status === 'Running' ? 'Idle' : 'Running';
    });
  }, interval);
};

const getJobs = () => {
  return jobs.map((job) => ({ ...job }));
};

export const JobsProvider = {
  startJobs,
  getJobs,
};
