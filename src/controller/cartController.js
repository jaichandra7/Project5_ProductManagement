const cartModel= require("../models/cartModel")
const mongoose=require('mongoose')
const validator = require("../validator/validation")
const jwt = require("jsonwebtoken");
const productModel= require("../models/productModel")
const userModel = require("../models/userModel");
const { findById } = require("../models/productModel");

const addToCart = async function(req,res)
{
    let userId=req.params.userId
    let data=req.body
    let{cartId,items,totalPrice,totalItems}=data
   // if(!cartId){
    let cartData = await cartModel.findOne({userId:userId, isDeleted:false})
   // if(!cartData) return res.status(404).send({status:false , message:""})
    if(cartData) {data.cartId=cartData.cartId}
    data.userId = userId
    // let productId = items.
    // let saveData = await cartModel.create(data)
    return res.status(201).send({status:true, message:"success",data:saveData})
    
}
module.exports={addToCart}