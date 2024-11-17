const EventEmitter = require('events');

class CronLoggerEvents extends EventEmitter {}

module.exports = new CronLoggerEvents();