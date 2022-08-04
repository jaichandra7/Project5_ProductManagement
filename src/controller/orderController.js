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
    let userId=req.params.userId
    data.userId=userId
    const orderData = await orderModel.create(data) //form
    res.status(201).send({ status: true, message: "Order Successfully Placed !!!", data: orderData })
}


//UPDATE ORDER API
const updateOrder= async function(req,res){
    let userId=req.params.userId
    let data = req.body
    let {orderId,status}=data
// console.log(status)
    const orderData = await orderModel.findOne({_id:orderId , cancellable:true })
    if(!orderData){
        return res.status(404).send({status:false, message:"Order is not Cancellable!"})
    }
    // console.log(orderData)
    orderData.status = status
    orderData.save()
    res.status(200).send({ status: true, message: "Order Update Successfully Updated !!!", data: orderData })
}

module.exports = { createOrder , updateOrder }