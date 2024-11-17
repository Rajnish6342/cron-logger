const EventEmitter = require('events');
const CronJob = require('cron').CronJob;

class CronLogger extends EventEmitter {
  constructor({ cronName, schedule, task, storageAdapter, batchSizeFn, retryPolicy = {} }) {
    super();
    this.cronName = cronName;
    this.schedule = schedule;
    this.task = task;
    this.storageAdapter = storageAdapter;
    this.batchSizeFn = batchSizeFn;
    this.retryPolicy = retryPolicy;
  }

  async wrapTask() {
    const startDateTime = new Date();
    let executionStatus = 'Success';
    let remarks = null;
    let batchSize = 0;

    try {
      await this.task();

      if (this.batchSizeFn) {
        batchSize = await this.batchSizeFn();
      }

      this.emit('success', { cronName: this.cronName, batchSize });
    } catch (error) {
      executionStatus = 'Failure';
      remarks = error.message;

      this.emit('failure', { cronName: this.cronName, error: remarks });

      if (this.retryPolicy.enabled) {
        await this.retryTask();
      }
    } finally {
      const endDateTime = new Date();

      await this.storageAdapter.log({
        cronName: this.cronName,
        startDateTime,
        endDateTime,
        executionStatus,
        remarks,
        batchSize,
      });

      this.emit('complete', { cronName: this.cronName, executionStatus, endDateTime });
    }
  }

  async retryTask() {
    console.log(`[${this.cronName}] Retrying...`);
    let attempts = 0;
    const { maxRetries, delay } = this.retryPolicy;

    while (attempts < maxRetries) {
      attempts++;
      try {
        await this.task();
        console.log(`[${this.cronName}] Retry succeeded.`);
        return;
      } catch (err) {
        console.error(`[${this.cronName}] Retry attempt ${attempts} failed.`);
        if (attempts < maxRetries) {
          await new Promise((res) => setTimeout(res, delay));
        } else {
          console.error(`[${this.cronName}] Maximum retry attempts reached.`);
        }
      }
    }
  }

  start() {
    const cronJob = new CronJob(this.schedule, this.wrapTask.bind(this));
    cronJob.start();
    console.log(`[${this.cronName}] Scheduled with pattern "${this.schedule}"`);
  }
}

module.exports = CronLogger;
