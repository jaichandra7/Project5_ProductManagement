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
    let userId=req.params.userId
    data.userId=userId
    const cartDetails = await cartModel.findById({_id:cartId}).select({_id:0})
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
    let finalData={...orderData.toObject()}
    delete finalData.__v
    delete finalData.isDeleted
    console.log(orderData)
    res.status(201).send({ status: true, message: "Order Successfully Placed !!!", data: finalData })
}


//UPDATE ORDER API
const updateOrder= async function(req,res){
    let userId=req.params.userId
    let data = req.body
    let {orderId,status}=data

    
    const orderData = await orderModel.findOne({_id:orderId})
    if(!orderData){
        return res.status(404).send({status:false, message:"Order is not Cancellable!"})
    }
    if(!orderData.cancellable && status=="cancelled") return res.status(400).send({status:false, message:"order is not cancellable"})
    orderData.status = status
    orderData.save()
    res.status(200).send({ status: true, message: "Order Update Successfully Updated !!!", data: orderData })
}

module.exports = { createOrder , updateOrder }