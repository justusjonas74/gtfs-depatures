module.exports = () => {
  /* istanbul ignore next */
  if ('TRAVIS' in process.env && 'CI' in process.env) return 'mongodb://127.0.0.1:27017'
  /* istanbul ignore next */
  const config = require('../config.json')
  /* istanbul ignore next */
  switch (process.env.NODE_ENV) {
    case 'test':
      return config.mongoUrl.test
    case 'production':
      return config.mongoUrl.production
    default: // includes development
      return config.mongoUrl.development
  }
}
