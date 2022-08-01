const mongoose = require('mongoose')
let ObjectId=mongoose.Schema.ObjectId
const userController= require('../controller/userController')

let cartSchema = new mongoose.Schema({
    
    userId: {type:ObjectId, ref:"user", required:true , unique: true},
    items: [{
      productId: {type:ObjectId, ref:"products", required:true},
      quantity: {type:Number, required:true, minlen: 1}
    }],
    totalPrice: {type:Number, required:true},
    totalItems: {type:Number, required:true},
  },
  {timestamps:true})

  module.exports=mongoose.model("cart",cartSchema)