const notFoundMiddleware = require('./not-found')
const errorHandlerMiddleware = require('./error-handler')
const authMiddleware = require('./auth')
module.exports = {
  notFoundMiddleware,
  errorHandlerMiddleware,
  authMiddleware,
}
