const express = require('express')
const router = express.Router()
const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadProductImage,
} = require('../controllers')

router.route('/').get(getAllProducts).post(createProduct)
router.route('/uploads').post(uploadProductImage)
router
  .route('/:id')
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct)

module.exports = router
