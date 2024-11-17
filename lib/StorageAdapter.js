class StorageAdapter {
  async log(logData) {
    throw new Error('log() method must be implemented by storage adapters.');
  }
}

module.exports = StorageAdapter;