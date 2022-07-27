const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const mongoose = require("mongoose")

    const authenticate = function (req, res, next) {
        try {
            let token = req.headers.authorization 
            // console.log(token)
            if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
             token = req.headers.authorization.slice(7)
             decodedToken = jwt.verify(token, "Group10-Product-Management", 
            
            function(err){
                if(err)
                return res.status(401).send({status:false,message:"Token is NOT Valid"})
    
                next()
            } );
            //if (!decodedToken) return res.status(400).send({ status: false, msg: "token is invalid" });
        } catch (error) {
            res.status(500).send({ msg: error.message })
        }
    }


const authorise = async function (req, res, next) {
    try{
        let token = req.headers.authorization.slice(7)
    // if (!token) token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, "Group10-Product-Management")

    if (!decodedToken) return res.status(401).send({ status: false, msg: "token is not valid" })
    dataToBeModified = req.params.userId
    var isValid = mongoose.Types.ObjectId.isValid(dataToBeModified)
    if (!isValid) return res.status(400).send({ status: false, msg: "enter valid id" })
    let userData = await userModel.findById(dataToBeModified)
    if(!userData){return res.status(404).send({status:false,msg:"user not found"})}
    let userId = userData._id
    console.log(userId)
    let userLoggedIn = decodedToken.userId
    if (userId == userLoggedIn) {
        next()
    } else { return res.status(403).send({ status: false, msg: 'NOT AUTHORISED USER' }) }
}
catch (error) {
    res.status(500).send({ msg: error.message })
}
}

module.exports={authorise,authenticate}