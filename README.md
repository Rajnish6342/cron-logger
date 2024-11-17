
# **cron-logger**

`cron-logger` is a reusable and extensible package for Node.js that simplifies logging and monitoring for scheduled CRON jobs. It provides advanced features such as pluggable storage, event-driven architecture, retry policies, and batch size tracking, making it ideal for microservices and enterprise-grade applications.

---

## **Features**

- **Pluggable Storage Adapters**: Supports MongoDB, PostgreSQL, or custom storage mechanisms.
- **Event-Driven**: Emit events on success, failure, and completion for real-time monitoring and alerting.
- **Retry Policies**: Automatically retry failed jobs with configurable settings.
- **Batch Size Tracking**: Capture metadata about the number of records processed.
- **Flexible Configuration**: Environment-based and easily customizable through JSON or code.
- **TypeScript Support**: Includes TypeScript definitions for type-safe development.

---

## **Installation**

Install the package via npm:

```bash
npm install cron-logger
```

---

## **Getting Started**

### **Basic Usage**

Here's how to use `cron-logger` in your Node.js application:

#### **Step 1: Import and Configure**

```javascript
const mongoose = require('mongoose');
const CronLogger = require('cron-logger');
const MongoDBAdapter = require('cron-logger/lib/adapters/MongoDBAdapter');
const AuditLog = require('./models/AuditLog'); // Your MongoDB model

mongoose.connect('mongodb://localhost:27017/auditLogs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a MongoDB storage adapter
const mongoAdapter = new MongoDBAdapter(AuditLog);

// Define your CRON task
const exampleTask = async () => {
  console.log('Processing records...');
  const recordsProcessed = Math.floor(Math.random() * 100);
  if (recordsProcessed === 0) throw new Error('No records processed.');
};

// Define batch size function (optional)
const exampleBatchSizeFn = async () => Math.floor(Math.random() * 100);

// Initialize CronLogger
const cronLogger = new CronLogger({
  cronName: 'Example Job',
  schedule: '*/5 * * * * *', // Run every 5 seconds
  task: exampleTask,
  storageAdapter: mongoAdapter,
  batchSizeFn: exampleBatchSizeFn,
  retryPolicy: { enabled: true, maxRetries: 3, delay: 5000 },
});

// Hook into events
cronLogger.on('success', (log) => console.log(`[${log.cronName}] Task succeeded.`));
cronLogger.on('failure', (log) => console.error(`[${log.cronName}] Task failed: ${log.error}`));
cronLogger.on('complete', (log) => console.log(`[${log.cronName}] Task complete: ${log.executionStatus}`));

// Start the CRON job
cronLogger.start();
```

---

## **Configuration Options**

### **CronLogger Options**

| Option             | Type         | Required | Description                                                               |
| ------------------ | ------------ | -------- | ------------------------------------------------------------------------- |
| `cronName`       | `string`   | Yes      | A unique name for the CRON job.                                           |
| `schedule`       | `string`   | Yes      | CRON expression for scheduling (e.g.,`*/5 * * * * *`).                  |
| `task`           | `function` | Yes      | The task to be executed by the CRON job. Must return a Promise.           |
| `storageAdapter` | `object`   | Yes      | An adapter to store audit logs (e.g., MongoDB, PostgreSQL).               |
| `batchSizeFn`    | `function` | No       | Function to calculate the batch size (e.g., number of records processed). |
| `retryPolicy`    | `object`   | No       | Configuration for retrying failed tasks (see below).                      |

### **Retry Policy**

The `retryPolicy` object allows you to configure automatic retries for failed jobs.

| Option         | Type        | Default   | Description                                |
| -------------- | ----------- | --------- | ------------------------------------------ |
| `enabled`    | `boolean` | `false` | Whether retries are enabled.               |
| `maxRetries` | `number`  | `3`     | Maximum number of retries for failed jobs. |
| `delay`      | `number`  | `5000`  | Delay between retries in milliseconds.     |

---

## **Storage Adapters**

The package supports pluggable storage adapters for logging. Here's how to use the built-in MongoDB adapter or create a custom one.

### **MongoDB Adapter**

Use the provided `MongoDBAdapter`:

```javascript
const MongoDBAdapter = require('cron-logger/lib/adapters/MongoDBAdapter');
const AuditLog = require('./models/AuditLog'); // Your MongoDB model

const mongoAdapter = new MongoDBAdapter(AuditLog);
```

### **Custom Adapter**

Implement the `StorageAdapter` interface to create your own adapter:

```javascript
const StorageAdapter = require('cron-logger/lib/StorageAdapter');

class CustomAdapter extends StorageAdapter {
  async log(logData) {
    // Custom logic to store log data
    console.log('CustomAdapter logging data:', logData);
  }
}

module.exports = CustomAdapter;
```

---

## **Events**

`cron-logger` emits the following events for monitoring and alerting:

| Event        | Payload                                        | Description                                              |
| ------------ | ---------------------------------------------- | -------------------------------------------------------- |
| `success`  | `{ cronName, batchSize }`                    | Emitted when the task completes successfully.            |
| `failure`  | `{ cronName, error }`                        | Emitted when the task fails.                             |
| `complete` | `{ cronName, executionStatus, endDateTime }` | Emitted after the task execution, regardless of outcome. |

---

## **TypeScript Support**

The package includes TypeScript type definitions. Example usage:

```typescript
import CronLogger, { CronLoggerOptions } from 'cron-logger';

const options: CronLoggerOptions = {
  cronName: 'Example Job',
  schedule: '*/5 * * * * *',
  task: async () => { console.log('Task executed'); },
  storageAdapter: new MongoDBAdapter(AuditLog),
};
const cronLogger = new CronLogger(options);
cronLogger.start();
```

---

## **Example CRON Schedules**

| Expression        | Description                          |
| ----------------- | ------------------------------------ |
| `*/5 * * * * *` | Every 5 seconds                      |
| `0 */1 * * * *` | Every 1 minute                       |
| `0 0 * * * *`   | Every hour                           |
| `0 0 0 * * *`   | Every day at midnight                |
| `0 0 0 1 * *`   | First day of every month at midnight |

---

## **Contributing**

We welcome contributions! Please fork the repository, make your changes, and submit a pull request. Ensure your code passes all tests and adheres to the project's coding standards.

---

## **License**

`cron-logger` is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
