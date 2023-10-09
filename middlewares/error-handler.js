const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = async (err, req, res, next) => {
  let { statusCode, msg } = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  }

  // set conditions for reassigment
  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST
    msg = Object.values(err.errors)
      .map((i) => i.message)
      .join(', ')
  }
  if (err.code === 11000) {
    statusCode = StatusCodes.BAD_REQUEST
    msg = `The ${Object.keys(
      err.keyValue
    )} already exists, login or try a diffrent ${Object.keys(err.keyValue)}`
  }
  if (err.name === 'CastError') {
    statusCode = StatusCodes.NOT_FOUND
    msg = `No product exists with id ${err.value}`
  }
  res.status(statusCode).json({ success: false, msg })
}

module.exports = errorHandlerMiddleware
