const { BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const uploadProductImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('No image uploaded')
  }
  const productImage = req.files.image
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('File must be an image')
  }
  const maxFileSize = 1024 * 1024
  if (productImage.size > maxFileSize) {
    throw new BadRequestError('File must be no more than 1MB')
  }
  const imagePath = productImage.tempFilePath
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'product-images',
  }
  const result = await cloudinary.uploader.upload(imagePath, options)
  fs.unlinkSync(imagePath)
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

module.exports = { uploadProductImage }
