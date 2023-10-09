const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllProducts = async (req, res) => {
  const { userID } = req.user
  const products = await Product.find({ createdBy: userID })
  res.status(StatusCodes.OK).json({ products })
}
const getSingleProduct = async (req, res) => {
  const {
    params: { id: productID },
    user: { userID },
  } = req
  const product = await Product.findOne({ createdBy: userID, _id: productID })
  if (!product) {
    throw new NotFoundError(`No product exists with id ${productID}`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const createProduct = async (req, res) => {
  const { userID } = req.user
  req.body.createdBy = userID
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}
const updateProduct = async (req, res) => {
  const {
    body: { name, price, image },
    user: { userID },
    params: { id: productID },
  } = req
  if (name === '' || price === '' || image === '') {
    throw new BadRequestError('Please provide name, price and image')
  }
  const product = await Product.findOneAndUpdate(
    {
      createdBy: userID,
      _id: productID,
    },
    req.body,
    { new: true, runValidators: true }
  )
  if (!product) {
    throw new NotFoundError(`No product exists with id ${productID}`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const deleteProduct = async (req, res) => {
  const {
    user: { userID },
    params: { id: productID },
  } = req
  const product = await Product.findOneAndDelete({
    createdBy: userID,
    _id: productID,
  })
  if (!product) {
    throw new NotFoundError(`No product exists with id ${productID}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
