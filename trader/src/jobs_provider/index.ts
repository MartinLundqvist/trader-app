import { Job } from '../types/index.js';
import { runPlaceOrders } from './runPlaceOrders.js';
import { runRefreshMarketData } from './runRefreshMarketData.js';
import { runRefreshStrategy } from './runRefreshStrategy.js';

const jobQueue: Job[] = [];
const pendingJobs: Job[] = [];
const completedJobs: Job[] = [];

interface Worker {
  id: Job['id'];
  execute: (job: Job) => Promise<void>;
}

const workers: Worker[] = [
  {
    id: 'refresh-strategy',
    execute: async (job: Job) => runRefreshStrategy(job),
  },
  {
    id: 'refresh-market-data',
    execute: async (job: Job) => runRefreshMarketData(job),
  },
  {
    id: 'place-orders',
    execute: async (job: Job) => runPlaceOrders(job),
  },
];

const startJobs = (interval: number) => {
  setInterval(() => {
    const job = jobQueue.shift();

    if (!job) return;

    const worker = workers.find((worker) => worker.id === job.id);

    console.log(
      `Starting job ${job.id} with variables ${JSON.stringify(
        job.variables
      )}...`
    );

    worker &&
      worker.execute(job).then(() => {
        console.log(`Job ${job.id} complete.`);
        if (job.status === 'failed') {
          console.log(`Error: ${job.message}`);
          pendingJobs.splice(pendingJobs.indexOf(job), 1);
          completedJobs.push(job);
        }
        if (job.status === 'completed') {
          pendingJobs.splice(pendingJobs.indexOf(job), 1);
          completedJobs.push(job);
        }
      });
  }, interval);
};

const getJobs = () => {
  const results = {
    pending: pendingJobs.map((job) => ({ ...job })),
    completed: completedJobs.map((job) => ({ ...job })),
  };

  return results;
};

// const addJob = (job: Pick<Job, 'id' | 'variables'>) => {
const addJob = (
  job: Omit<Job, 'status' | 'progress' | 'message' | 'added'>
) => {
  const newJob: Job = {
    ...job,
    status: 'pending',
    progress: 0,
    message: '',
    added: new Date(),
  };

  jobQueue.push(newJob);

  pendingJobs.push(newJob);
};

const JobsProvider = {
  startJobs,
  getJobs,
  addJob,
};

export default JobsProvider;
