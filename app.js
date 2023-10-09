require('dotenv').config()
require('express-async-errors')
// app security
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const {
  errorHandlerMiddleware,
  notFoundMiddleware,
  authMiddleware,
} = require('./middlewares')
const authRoutes = require('./routers/auth-routes')
const productRoutes = require('./routers/product-routes')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
})
app.use(cors())
app.use(helmet())
app.use(xss())

// middlewares
// parse html form data
app.use(express.urlencoded({ extended: false }))
// parse json data
app.use(express.json())
// file upload
app.use(fileUpload({ useTempFiles: true }))

// static resources
app.use(express.static('./public'))
// routes
app.use('/api/v1/products/auth', authRoutes)
app.use('/api/v1/products', authMiddleware, productRoutes)
// not-found
app.use(notFoundMiddleware)
// error-handler
app.use(errorHandlerMiddleware)
// start
const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}
start()
