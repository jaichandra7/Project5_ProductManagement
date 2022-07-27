const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const middleware = require("../middleware/auth")
// const internController = require('../controllers/internController')

//API's

router.post('/register', userController.createUser )

 router.post('/login', userController.loginUser)

 router.get('/user/:userId/profile',middleware.authenticate,middleware.authorise,userController.getUser)

 router.put('/user/:userId/profile',middleware.authenticate,middleware.authorise,userController.updateUser)


// router.all("/**", function (req, res) {
//     res.status(404).send({
//         status: false,
//         msg: "Make Sure Your Endpoint is Correct or Not!"
//     })
// })


module.exports = router