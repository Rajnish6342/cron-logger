const StorageAdapter = require('../StorageAdapter');

class MongoDBAdapter extends StorageAdapter {
  constructor(mongoModel) {
    super();
    this.mongoModel = mongoModel;
  }

  async log(logData) {
    try {
      await this.mongoModel.create(logData);
      console.log('[MongoDBAdapter] Log saved successfully.');
    } catch (error) {
      console.error('[MongoDBAdapter] Failed to save log:', error.message);
    }
  }
}

module.exports = MongoDBAdapter;