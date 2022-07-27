const productModel=require("../models/productModel");
const mongoose=require("mongoose")
const validator=require("../validator/validation")
const {uploadFile} = require("../aws/awsConnect")


//product creation
const createProduct = async function(req,res){
    let data = req.body
    let {title,description,price,currencyId,CurrencyFormat,isFreeShipping,style,availableSizes,installments,isDeleted}=data
    if(!validator.isValidRequest(data))
    return res.status(400).send({status:false, msg:"Enter Product Details "}) //it should not be blank
    
    //Title Validation
    if(!validator.isValidString(title))
    return res.status(400).send({status:false, msg:"Title Is Required "}) // it should be string
     if(!validator.isValidName(title))
    return res.status(400).send({status:false, msg:"Enter Valid Title "})
    //Description validation
    if(!validator.isValidString(description))
    return res.status(400).send({status:false, msg:"Description Is Required "}) // it should be string
     if(!validator.isvalidStreet(description))
    return res.status(400).send({status:false, msg:"Enter Valid Description "})

    //Price Validation
    // if(!validator.isValidNumber(price))
    // return res.status(400).send({status:false, msg:"Price Is Required "}) // it should be string
     if(!validator.isValidPrice(price))
    return res.status(400).send({status:false, msg:"Enter Valid Price "})

    if(!validator.isValidString(currencyId))
    return res.status(400).send({status:false, msg:"CurrencyId Is Required "})
    if(currencyId!=="INR") return res.status(400).send({status:false , message:"Enter Valid Currency Id"})
    let productImage=req.files
         
    // if(!validator.isValidImage(productImage))
    // return res.status(400).send({status:false, msg:"Give valid Image File"})
 
    if(!(productImage&&productImage.length)) {
        return res.status(400).send({ status: false, message: " Please Provide The product Image" });}
    const uploadedproductImage = await uploadFile(productImage[0])
    data.productImage=uploadedproductImage

    let saveData= await productModel.create(data)
    return res.status(201).send({ status:true ,   message: 'Success', data:saveData})
}

// get products
const getProducts = async function(req,res){
    let data = req.query
    let {size,name,priceLessThan,priceGreaterThan} = data
    console.log(name)
    let productData = {isDeleted:false}
  
    if(size){productData.availableSizes = size}
    if(name){productData.title = name}
    if(priceLessThan){productData.price = priceLessThan}
    if(priceGreaterThan){productData.price = priceGreaterThan}
    console.log(priceLessThan)
    let productsByFilter = await productModel.find(productData).sort({price: 1})
    if(productsByFilter.length==0) return res.status(404).send({status:false , message: "No Data Found"})
    res.status(200).send({status:true , data:productsByFilter})

    
}

// Get Products BY Id
const getProductsById = async function(req,res){
 let productId = req.params.productId
 var isValid = mongoose.Types.ObjectId.isValid(productId)
if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Product Id" })
 let productsDetails = await productModel.findOne({_id:productId, isDeleted:false})
 if(!productsDetails) {
    return res.status(404).send({status:false, message:"Product Not Found"})
 }else{
    return res.status(200).send({status:true , message:"Success" , data:productsDetails})
    }  
}

//
const delProductsById = async function(req,res){
    let productId = req.params.productId
    var isValid = mongoose.Types.ObjectId.isValid(productId)
   if (!isValid) return res.status(400).send({ status: false, msg: "Enter Valid Product Id" })
    let productsDetails = await productModel.findOneAndUpdate({_id:productId, isDeleted:false} ,{isDeleted:true, deletedAt:Date.now()}, {new:true})
    if(!productsDetails) {
       return res.status(404).send({status:false, message:"Product Not Found"})
    }else{
       return res.status(200).send({status:true , message:"Successfully Deleted"})
       }  
   }

 module.exports={createProduct , getProducts , getProductsById , delProductsById}