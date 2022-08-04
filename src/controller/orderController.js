const cartModel = require("../models/cartModel")
const mongoose = require('mongoose')
const validator = require("../validator/validation")
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel")
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const { findById } = require("../models/productModel");


// CREATE ORDER API
const createOrder= async function(req,res){
    let data=req.body
    let {cartId,cancellable}=data
    var isValid = mongoose.Types.ObjectId.isValid(cartId)
    if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Cart Id" })
    if(typeof cancellable!=="boolean") return res.status(400).send({status:false, message: "Cancellable Should Be Boolean Value"})
    let userId=req.params.userId
    data.userId=userId
    const cartDetails = await cartModel.findById({_id:cartId}).select({_id:0})
    if(!cartDetails) return res.status(404).send({status:false , message: "Cart Does Not Exist"})
     if(!cartDetails.items.length) return res.status(400).send({status:false, message: "Your Cart Is Empty" })
    let UserIdIncart=cartDetails.userId
    if (UserIdIncart != userId) return res.status(403).send({ status: false, message: "Entered UserId does not match with the user Id in cart" })
    let items= cartDetails.items
    let sum = 0
    for(let i=0;i<items.length;i++){
        sum+=items[i].quantity
    }
    console.log(sum)
    let obj={...cartDetails.toObject(),cancellable:data.cancellable,totalQuantity:sum}
    // cartDetails.totalQuantity=sum
    console.log(obj)
    const orderData = await orderModel.create(obj) //form
    await cartModel.findOneAndUpdate({_id:cartId},{items:[],totalPrice:0,totalItems:0})
    let finalData={...orderData.toObject()}
    delete finalData.__v
    delete finalData.isDeleted
    console.log(orderData)
    res.status(201).send({ status: true, message: "Order Successfully Placed !!!", data: finalData })
    
}


//======================================================UPDATE ORDER API==========================================

const updateOrder= async function(req,res){

    let userId=req.params.userId
    let data = req.body
    let {orderId,status}=data

    //orderId validation
    var isValid = mongoose.Types.ObjectId.isValid(orderId)
    if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Order Id" })

    //status validation
    if(!validator.isValidString(status)) return res.status(400).send({ status: false, msg: "Status Must Be In String" })
    let statusArray=["pending","cancelled","completed"]
    if(statusArray.indexOf(status) == -1) return res.status(400).send({status:false, message:"Status Must Be among pending,cancellable and completed"})

    const orderData = await orderModel.findOne({_id:orderId })
    if(!orderData){
        return res.status(404).send({status:false, message:"Order Does Not Exist"})
    }

    //checking userId in orde and in parm path matches or not
    let userIdInOrder = orderData.userId
    if (userIdInOrder != userId) return res.status(403).send({ status: false, message: "Entered UserId does not match with the user Id in Order" })
    
    if(!orderData.cancellable && status=="cancelled") return res.status(400).send({status:false, message: "It Is Not Cancellable Order"})
    orderData.status = status
    orderData.save()
    res.status(200).send({ status: true, message: "Order Updated Successfully", data: orderData })
}

module.exports = { createOrder , updateOrder }