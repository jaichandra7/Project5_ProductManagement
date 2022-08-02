const cartModel = require("../models/cartModel")
const mongoose = require('mongoose')
const validator = require("../validator/validation")
const jwt = require("jsonwebtoken");
const productModel = require("../models/productModel")
const userModel = require("../models/userModel");
const { findById } = require("../models/productModel");

const addToCart = async function (req, res) {
    let userId = req.params.userId
    let data = req.body
    let { cartId, items, totalPrice, totalItems } = data
    data.userId = userId
    let cartData = await cartModel.findOne({ userId: userId, isDeleted: false })
    if (cartData) {
        let sum = cartData.totalPrice
        let length = cartData.totalItems
        let cartId = cartData._id
        let array = []
        for (let i = 0; i < items.length; i++) {
            let productData = await productModel.findOne({ _id: items[i].productId })
            if (!productData) return res.status(400).send({ status: false, message: "ProductId Is Not Valid" })
            sum = sum+(productData.price*items[i].quantity)
            length = length+items[i].quantity
            array.push(items[i])
        }
        let itemsAdded = await cartModel.findOneAndUpdate({ _id: cartId }, { $addToSet: { items: [...array] } }, { new: true })
        itemsAdded.totalPrice = sum
        itemsAdded.totalItems = length
        return res.status(200).send({ status: true, message: "success", data: itemsAdded })
    }
    let saveData = await cartModel.create(data)
    return res.status(201).send({ status: true, message: "success", data: saveData })

}
module.exports = { addToCart }