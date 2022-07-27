const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const productController=require('../controller/productController')
const middleware = require("../middleware/auth")
// const internController = require('../controllers/internController')

//API's

router.post('/register', userController.createUser )

 router.post('/login', userController.loginUser)

 router.get('/user/:userId/profile',middleware.authenticate,middleware.authorise,userController.getUser)

 router.put('/user/:userId/profile',middleware.authenticate,middleware.authorise,userController.updateUser)

 router.post('/products', productController.createProduct)

 router.get('/products', productController.getProducts)

 router.get('/products/:productId', productController.getProductsById)

router.delete('/products/:productId', productController.delProductsById)

// router.all("/**", function (req, res) {
//     res.status(404).send({
//         status: false,
//         msg: "Make Sure Your Endpoint is Correct or Not!"
//     })
// })


module.exports = router