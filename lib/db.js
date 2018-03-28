function connectDatabase (mongoose, config) {
  /* istanbul ignore next */
  if ('TRAVIS' in process.env && 'CI' in process.env) return mongoose.connect('mongodb://127.0.0.1:27017')
  /* istanbul ignore next */
  switch (process.env.NODE_ENV) {
    case 'test':
      return mongoose.connect(config.mongoUrl.test)
    case 'production':
      return mongoose.connect(config.mongoUrl.production)
    default: // includes development
      return mongoose.connect(config.mongoUrl.development)
  }
}

module.exports.connectDatabase = connectDatabase
