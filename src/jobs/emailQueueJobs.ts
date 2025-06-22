import { Job, Queue, Worker } from "bullmq";
import { redisConnection, defaultJobOptions } from "../helpers/queue";
import { sendMail } from "../helpers/mailer";

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultJobOptions,
});

export type emailWorkerInputType = {
  email: string;
  subject: string;
  body: string;
};

export const emailWorker = new Worker(
  emailQueueName,
  async (job: Job<emailWorkerInputType>) => {
    // Process the email job
    const { email, subject, body } = job.data;
    sendMail(email, subject, body);
  },
  {
    connection: redisConnection,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed successfully`);
});
emailWorker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed with error: ${err.message}`);
});
