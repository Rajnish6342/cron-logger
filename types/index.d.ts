export interface CronLoggerOptions {
  cronName: string;
  schedule: string;
  task: () => Promise<void>;
  storageAdapter: any;
  batchSizeFn?: () => Promise<number>;
  retryPolicy?: {
    enabled: boolean;
    maxRetries: number;
    delay: number;
  };
}