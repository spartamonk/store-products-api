const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} = require('./product-controllers')
const { uploadProductImage } = require('./upload-controller')
const { login, register, updateUser } = require('./auth-controllers')

module.exports = {
  login,
  register,
  updateUser,
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadProductImage,
}
