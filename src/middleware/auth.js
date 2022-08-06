const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const mongoose = require("mongoose")

const authenticate = function (req, res, next) {
    try {
        let token = req.headers.authorization
        
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        token = req.headers.authorization.slice(7)
        decodedToken = jwt.verify(token, "Group10-Product-Management",

            function (err) {
                if (err)
                    return res.status(401).send({ status: false, message: "Token is NOT Valid" })

                next()
            });
       
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


const authorise = async function (req, res, next) {
    try {
        let token = req.headers.authorization.slice(7)

        let decodedToken = jwt.verify(token, "Group10-Product-Management")
        if (!decodedToken) return res.status(401).send({ status: false, message: "token is not valid" })
        dataToBeModified = req.params.userId
        var isValid = mongoose.Types.ObjectId.isValid(dataToBeModified)
        if (!isValid) return res.status(400).send({ status: false, message: "Enter Valid User Id" })
        let userData = await userModel.findById(dataToBeModified)
        if (!userData) { return res.status(404).send({ status: false, message: "user not found" }) }
        let userId = userData._id
        let userLoggedIn = decodedToken.userId
        if (userId == userLoggedIn) {
            next()
        } else { return res.status(403).send({ status: false, message: 'NOT AUTHORISED USER' }) }
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }
}

module.exports = { authorise, authenticate }