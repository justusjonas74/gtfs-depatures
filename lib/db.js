function connectDatabase (mongoose) {
  const config = require('../config.json')
  switch (process.env.NODE_ENV) {
    case 'test':
      mongoose.connect(config.mongoUrl.test)
      break
    case 'production':
      mongoose.connect(config.mongoUrl.production)
      break
    default: // include development
      mongoose.connect(config.mongoUrl.development)
  }
}

module.exports.connectDatabase = connectDatabase
