const userModel=require("../models/productModel");
const mongoose=require("mongoose")
const validator=require("../validator/validation")
const {uploadFile} = require("../aws/awsConnect")
const jwt = require("jsonwebtoken");

//put API
const updateProduct = async function(req,res){
    let userId = req.params.productId

    if (!isValid) return res.status(400).send({ status: false, msg: "enter valid id" })
    let userData = await userModel.findById(dataToBeModified)

    let data = req.body
    let {title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments,isDeleted}=data

    
    if(!validator.isValidRequest(data))
    return res.status(400).send({status:false, msg:"Enter User Details "}) //it should not be blank

    //title validation
    if(title){
    if(!validator.isValidString(title))
    return res.status(400).send({status:false, msg:"title Name Is Required "}) // it should be string

    if(!validator.isValidName(title))
    return res.status(400).send({status:false, msg:"Enter Valid title "})
    }

     //description validation
    if(description){
    if(!validator.isValidString(description))
    return res.status(400).send({status:false, msg:"description Is Required "}) // it should be string

    if(!validator.isValidStreet(description))
    return res.status(400).send({status:false, msg:"Enter Valid Last Description "})
    }

    //price validation
    // if(!validator.isValidNumber(price))
    // return res.status(400).send({status:false, msg:"title Name Is Required "}) 

    if(currencyId){
        if(!validator.isValidString(currencyId))
        return res.status(400).send({status:false, msg:"currency Id is Required "}) 

        if(currencyId!=="INR")   return res.status(400).send({status:false, msg:"currency Id must be INR"}) 
    }

    //currencyFormat validation
    if(currencyFormat){
        if(!validator.isValidString(currencyFormat))
        return res.status(400).send({status:false, msg:"currency Id is Required "}) 

        if(currencyId!=="₹")   return res.status(400).send({status:false, msg:"currency format must be ₹"}) 
    }

    //style validation
    if(style){
            if(!validator.isValidString(style))
            return res.status(400).send({status:false, msg:"style Is Required "}) // it should be string
        
            if(!validator.isValidName(style))
            return res.status(400).send({status:false, msg:"Enter Valid style "})         
    }

    //isAvailableSize validation
    if (Array.isArray(availableSizes)) {
        if (availableSizes.length == 0) { return res.status(400).send({ status: false, message: "empty array is not accepted " }) }
        for (let i = 0; i < availableSizes.length; i++) {
            if (!availableSizes[i] || typeof availableSizes[i] !== 'string' || availableSizes[i].trim().length === 0) return res.status(400).send({ status: false, message: " subcategory should be string" })
            let productSize = /^(S|XS|M|X|L|XXL|XL){0,3}$/.test(availableSizes[i].trim())
            if (!productSize) return res.status(400).send({ status: false, message: "enter valid subcategory" })

        }
    }

    if (typeof (availableSizes) == "string") {
        if (!isValid(availableSizes)) { return res.status(400).send({ status: false, message: "availableSizes is required!" }) }
        let productSize = /^(S|XS|M|X|L|XXL|XL){0,3}$/.test(availableSizes.trim())
        if (!productSize) return res.status(400).send({ status: false, message: "enter valid availableSizes " })
    }

   
    

    //isFreeShipping validation
    if(isFreeShipping){
        if(!validator.isBoolean(isFreeShipping))
        return res.status(400).send({status:false, msg:"isFreeShipping must be a boolean value"}) 

    }

    //isDeleted validation
    if(isDeleted){
        if(!validator.isBoolean(isDeleted))
        return res.status(400).send({status:false, msg:"isDeleted must be a boolean value"}) 
    }

    let updateData = await userModel.findByIdAndUpdate({_id:productId,isDeleted:false} ,data, {new:true})
    res.status(200).send({ status:true, message: "updated  Successfully" , data:updateData})

}