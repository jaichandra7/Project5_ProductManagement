const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const productController = require('../controller/productController')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController')
const middleware = require("../middleware/auth")
// const internController = require('../controllers/internController')

//API's

router.post('/register', userController.createUser)

router.post('/login', userController.loginUser)

router.get('/user/:userId/profile', middleware.authenticate, middleware.authorise, userController.getUser)

router.put('/user/:userId/profile', middleware.authenticate, middleware.authorise, userController.updateUser)

//--------------------------------------------------------------------------------------------------------------------------------------

router.post('/products', productController.createProduct)

router.get('/products', productController.getProducts)

router.get('/products/:productId', productController.getProductsById)

router.delete('/products/:productId', productController.delProductsById)

router.put('/products/:productId', productController.updateProduct)


//------------------------------------------------------------------------------------------------------------------------------------------

router.post('/users/:userId/cart', cartController.addToCart)

router.get('/users/:userId/cart', middleware.authenticate, middleware.authorise , cartController.getCart)

router.delete('/users/:userId/cart',middleware.authenticate, middleware.authorise , cartController.delCart)

router.put('/users/:userId/cart', cartController.updateCart)

//---------------------------------------------------------------------------------------------------------------------------------------------

router.post('/users/:userId/orders',orderController.createOrder)

router.put('/users/:userId/orders',orderController.updateOrder)


router.all("/*", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "Incorrect URL"
    })
})


module.exports = router