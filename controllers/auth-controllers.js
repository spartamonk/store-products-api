const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const register = async (req, res) => {
  const user = await User.create(req.body)
  const { name, email } = user
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name, email, token } })
}

const login = async (req, res) => {
  const {
    body: { email, password },
  } = req
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Please provide valid credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Please provide valid credentials')
  }
  const token = user.createJWT()
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email, token } })
}
const updateUser = async (req, res) => {
  const {
    body: { name, email },
    user: { userID },
  } = req
  if (name === '' || email === '') {
    throw new BadRequestError(`Email and password cannot be empty fields`)
  }
  const user = await User.findOne({ _id: userID })
  user.name = name
  user.email = email
  await user.save()
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      token,
    },
  })
}

module.exports = {
  register,
  login,
  updateUser,
}
