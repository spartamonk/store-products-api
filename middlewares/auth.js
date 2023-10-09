const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization
  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  const token = authHeaders.split(' ')[1]
  try {
    const { userID, name } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userID, name }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Invalid credentials')
  }
}

module.exports = authMiddleware
