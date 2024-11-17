const StorageAdapter = require('../StorageAdapter');

class PostgreSQLAdapter extends StorageAdapter {
  constructor(pgClient, tableName = 'cron_audit_logs') {
    super();
    this.pgClient = pgClient;
    this.tableName = tableName;
  }

  async log(logData) {
    const { cronName, startDateTime, endDateTime, executionStatus, remarks, batchSize } = logData;
    
    const query = `
      INSERT INTO ${this.tableName} (cron_name, start_date_time, end_date_time, execution_status, remarks, batch_size)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [cronName, startDateTime, endDateTime, executionStatus, remarks, batchSize];

    try {
      await this.pgClient.query(query, values);
      console.log('[PostgreSQLAdapter] Log saved successfully.');
    } catch (error) {
      console.error('[PostgreSQLAdapter] Failed to save log:', error.message);
    }
  }
}

module.exports = PostgreSQLAdapter;
