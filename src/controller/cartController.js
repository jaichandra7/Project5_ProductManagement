const cartModel = require("../models/cartModel")
const mongoose = require('mongoose')
const validator = require("../validator/validation")
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel")
const userModel = require("../models/userModel");
const { findById } = require("../models/productModel");

// CREATE API
const addToCart = async function (req, res) {
    try{
    let userId = req.params.userId
    let data = req.body
    let { productId, cartId } = data

    var isValid = mongoose.Types.ObjectId.isValid(userId)
    if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid User Id" })

    let isUser = await userModel.findById(userId)
    if (!isUser) return res.status(404).send({ status: false, message: "user Does not exists" })

    if (!validator.isValidRequest(data))
        return res.status(400).send({ status: false, msg: "Enter Cart Details" })

    if (!cartId) {
        let isCart = await cartModel.findOne({ userId: userId })
        if (isCart) return res.status(400).send({ status: false, message: "Enter the Cart Id" })
        if (!productId) return res.status(400).send({ status: false, message: "Enter the Product Id" })

        var isValid = mongoose.Types.ObjectId.isValid(productId)
        if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Product Id" })

        var isProduct = await productModel.findOne({ isDeleted: false, _id: productId })
        if (!isProduct) return res.status(404).send({ status: false, message: "Product does not exists" })

        let items = [{ productId: productId, quantity: 1 }];

        let dataTobeAdded = { items: items, totalPrice: isProduct.price, totalItems: 1, userId: userId }
        let saveData = await cartModel.create(dataTobeAdded)
        res.status(201).send({ status: true, message: "New Cart created and added the desired product", data: saveData })
    }

    else {
        var isValid = mongoose.Types.ObjectId.isValid(cartId)
        if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Cart Id" })

        let iscart = await cartModel.findById(cartId)
        if (!iscart) return res.status(404).send({ status: false, message: "Cart does not exists" })

        let UserIdIncart = iscart.userId.toString()
        if (UserIdIncart != userId) return res.status(403).send({ status: false, message: "Entered UserId does not match with the user Id in cart" })

        if (!productId) return res.status(400).send({ status: false, message: "Enter the Product Id" })

        var isValid = mongoose.Types.ObjectId.isValid(productId)
        if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Product Id" })

        var isProduct = await productModel.findOne({ isDeleted: false, _id: productId })
        if (!isProduct) return res.status(404).send({ status: false, message: "Product does not exists" })

        let totalPrice = isProduct.price + iscart.totalPrice
        let totalItems = iscart.totalItems
        let items = iscart.items

        for (let i = 0; i < items.length; i++) {
            if (items[i].productId.toString() == productId) {
                iscart.items[i].quantity += 1;
                iscart.totalPrice = totalPrice

                iscart.save()
                // let dataToBeAdded = await cartModel.findOneAndUpdate({_id:cartId},obj, {new:true})
                return res.status(201).send({ status: true, data: iscart })
            }
        }
        let newArray = [{ productId: productId, quantity: 1 }]
        items = [...items, ...newArray]
        let obj = { totalPrice: totalPrice, totalItems: totalItems + 1, userId: userId, items: items }
        let dataToBeAdded = await cartModel.findOneAndUpdate({ _id: cartId }, obj, { new: true })
        res.status(201).send({ status: true, data: dataToBeAdded })
    }
}
    catch (err) {return res.status(500).send({status:false , message:err.message})}
}


// GET CART API
const getCart = async function (req, res) {
    try{
    let userId = req.params.userId
    let userData = await userModel.findById({ _id: userId })
    if (!userData) return res.status(404).send({ status: false, message: "No User Found" })
    let cartData = await cartModel.findOne({ userId: userId })
    if (!cartData) return res.status(404).send({ status: false, message: "Cart Not Found" })
    return res.status(200).send({ status: true, message: 'success', data: cartData })
}
    catch (err) {return res.status(500).send({status:false , message:err.message})}
}


// DELETE CART API
const delCart = async function (req, res) {
    try{
    let userId = req.params.userId
    let userData = await userModel.findById({ _id: userId })
    if (!userData) return res.status(404).send({ status: false, message: "No User Found" })
    let cartData = await cartModel.findOne({ userId: userId })
    if (!cartData) return res.status(404).send({ status: false, message: "Cart Not Found" })
    cartData.items = []
    cartData.totalItems = 0
    cartData.totalPrice = 0
    cartData.save()
    res.status(204).send({ status: true, message: "Cart Deleted Successfully", data: cartData })

}
    catch (err) {return res.status(500).send({status:false , message:err.message})}
}


// UPDATE CART API
const updateCart = async function (req, res) {
    try{
    let data = req.body
    let userId = req.params.userId
    let { productId, cartId, removeProduct } = data

    var isValid = mongoose.Types.ObjectId.isValid(userId)
    if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid User Id" })

    let isUser = await userModel.findById(userId)
    if (!isUser) return res.status(404).send({ status: false, message: "user Does not exists" })

    if (!validator.isValidRequest(data))
        return res.status(400).send({ status: false, msg: "Enter Cart Details" })

    if (!productId) return res.status(400).send({ status: false, message: "Enter the product Id" })
    var isValid = mongoose.Types.ObjectId.isValid(productId)
    if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Product Id" })
    let findProduct = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!findProduct) return res.status(404).send({ status: false, message: "Product doesn't exists" })

    if (!cartId) return res.status(400).send({ status: false, message: "Enter the Cart Id" })
    var isValid = mongoose.Types.ObjectId.isValid(cartId)
    if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Cart Id" })
    let findCart = await cartModel.findById(cartId)
    if (!findCart) return res.status(404).send({ status: false, message: "Cart does not exists" })
    let UserIdIncart = findCart.userId.toString()
    if (UserIdIncart != userId) return res.status(403).send({ status: false, message: "User Id in cart does not match with the entered Id" })

   if (!(!isNaN(Number(removeProduct))))  return res.status(400).send({ status: false, message: "remove product must be 0 or 1" })
   if (!((removeProduct === 0) || (removeProduct === 1))) return res.status(400).send({ status: false, message: "remove product must be 0 or 1" })
    let items = findCart.items
    if(removeProduct==0){
        for(let i=0;i<items.length;i++){
            if(items[i].productId==productId){
                findCart.totalPrice=findCart.totalPrice-findProduct.price*items[i].quantity
                items.splice(i,1)
                findCart.totalItems=findCart.totalItems-1
                
            }
        }
        findCart.save()
        return res.status(200).send({status:true , message:"success", data:findCart})
    }else{
        for(let i=0;i<items.length;i++){
            if(items[i].productId==productId){
                findCart.totalPrice=findCart.totalPrice-findProduct.price
                let quantity = items[i].quantity
                quantity=quantity-1
                items[i].quantity=quantity
                if(items[i].quantity==0){
                    items.splice(i,1)
                    findCart.totalItems=findCart.totalItems-1
                }
            }
        }
        findCart.save()
        return res.status(200).send({status:true , message:"success", data:findCart})
    }
}
    catch (err) {return res.status(500).send({status:false , message:err.message})}
}



module.exports = { addToCart, getCart, delCart, updateCart }