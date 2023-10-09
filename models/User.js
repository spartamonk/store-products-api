const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [50, 'Name is no more than 50 characters'],
    minlength: [2, 'Name is not less than 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password is not less than 6 characters'],
  },
})
// middlewares
// hash password
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
// methods
// compare passwors
UserSchema.methods.comparePassword = async function (userPassword) {
  const isPasswordMatch = await bcrypt.compare(userPassword, this.password)
  return isPasswordMatch
}
// creatJWT
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userID: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}
module.exports = mongoose.model('User', UserSchema)
