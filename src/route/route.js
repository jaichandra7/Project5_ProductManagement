const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
// const internController = require('../controllers/internController')

//API's

router.post('/register', userController.createUser )

// router.post('/functionup/interns', internController.addIntern)

 //router.get('/register',userController)


// router.all("/**", function (req, res) {
//     res.status(404).send({
//         status: false,
//         msg: "Make Sure Your Endpoint is Correct or Not!"
//     })
// })


module.exports = router