const bcrypt = require ('bcrypt');
const userModel=require("../models/userModel");
const mongoose=require("mongoose")
const validator=require("../validator/validation")
const {uploadFile} = require("../aws/awsConnect")
const jwt = require("jsonwebtoken");
const { findOneAndUpdate } = require('../models/userModel');


const createUser=async function (req,res){
        const data=req.body
        let {fname,lname,email,phone,address,password} = data;
       

        if(!validator.isValidRequest(data))
        return res.status(400).send({status:false, msg:"Enter User Details "}) //it should not be blank

        
        if(!validator.isValidString(fname))
        return res.status(400).send({status:false, msg:"First Name Is Required "}) // it should be string

        if(!validator.isValidName(fname))
        return res.status(400).send({status:false, msg:"Enter Valid First Name "})

         
        if(!validator.isValidString(lname))
        return res.status(400).send({status:false, msg:"Last Name Is Required "}) // it should be string

        if(!validator.isValidName(lname))
        return res.status(400).send({status:false, msg:"Enter Valid Last Name "})

        if(!validator.isValidString(email))
        return res.status(400).send({status:false, msg:"Email Is Required "}) // it should be string

        if(!validator.isValidEmail(email))
        return res.status(400).send({status:false, msg:"Email Is Not Valid "})

        if(!validator.isValidString(phone))
        return res.status(400).send({status:false, msg:" Phone Number is Required "})

        if(!validator.isValidMobile(phone))
        return res.status(400).send({status:false, msg:" Enter The Valid Number "})

        const isDuplicate = await userModel.findOne({$or:[{email:email},{phone:phone}]})
        if(isDuplicate) return res.status(400).send({status:false, msg:` Email or Phone Number Already Exist`})

        if(!validator.isValidString(password))
        return res.status(400).send({status:false, msg:"Password Is Required "})

        if(!validator.isValidPassword(password))
        return res.status(400).send({status:false, msg:" Password Must be Include One special_char,Uppercase,Lowercase and Number ,Min 8 & Max 15 Char Are Allowed"})

       
        const encryptPassword = await bcrypt.hash(password, 10)
        data.password = encryptPassword;
        console.log(encryptPassword)

        //to updtae profile Image
        let profileImage=req.files
         
        // if(!validator.isValidImage(profileImage))
        // return res.status(400).send({status:false, msg:"Give valid Image File"})
     
        if(!(profileImage&&profileImage.length)) {
            return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });}
        const uploadedProfileImage = await uploadFile(profileImage[0])
        data.profileImage=uploadedProfileImage
        
// address
        if(data.address){
        var parsedAddress = JSON.parse(data.address)
          console.log(parsedAddress)
          let {shipping,billing}=parsedAddress

          if(!validator.isValidString(shipping.street))
          return res.status(400).send({status:false, msg:"Street Is Required,should be in string value "})

          if(!validator.isvalidStreet(shipping.street))
          return res.status(400).send({status:false, msg:"Enter Valid Street"})

          if(!validator.isValidString(shipping.city))
          return res.status(400).send({status:false, msg:"city Is Required,should be in string value "})

          if(!validator.isValidName(shipping.city))
          return res.status(400).send({status:false, msg:"Enter Valid city"})

          if(!validator.isValidNumber(shipping.pincode))
          return res.status(400).send({status:false, msg:"Pincode should be numerical"})

          if(!validator.isvalidPincode(shipping.pincode))
          return res.status(400).send({status:false, msg:"Enter Valid Pincode "})


          if(!validator.isValidString(billing.street))
          return res.status(400).send({status:false, msg:"Street Is Required,should be in string value "})

          if(!validator.isvalidStreet(billing.street))
          return res.status(400).send({status:false, msg:"Enter Valid Street"})

          if(!validator.isValidString(billing.city))
          return res.status(400).send({status:false, msg:"city Is Required,should be in string value "})

          if(!validator.isValidName(billing.city))
          return res.status(400).send({status:false, msg:"Enter Valid city"})
          
          if(!validator.isValidNumber(billing.pincode))
          return res.status(400).send({status:false, msg:"Pincode should be numerical"})

          if(!validator.isvalidPincode(billing.pincode))
          return res.status(400).send({status:false, msg:"Enter Valid Pincode "})


        }
      

          data.address=parsedAddress
        const userData= await userModel.create(data) //form
        res.status(201).send({status:true, message:"user successfully created",data:userData})
}

const loginUser= async function(req,res){
  let data = req.body
  let {email, password} = data

  if(!validator.isValidRequest(data))
  return res.status(400).send({status:false, msg:"Enter your email and password "})

  if(!validator.isValidString(email))
  return res.status(400).send({status:false, msg:"Email Is Required "})

  if(!validator.isValidString(password))
  return res.status(400).send({status:false, msg:"password Is Required "})

  const isUser = await userModel.findOne({email:email})
  if(!isUser) { return res.status(404).send({status:false, message:"User not found"})}

 let encryptPwd = isUser.password
 
let decryptPwd =  await bcrypt.compare(password, encryptPwd,function(err, result) {
  if (result) {
    let token = jwt.sign({userId: isUser._id.toString(),iat: Math.floor(Date.now() / 1000) },"Group10-Product-Management", {expiresIn: '24h'});
    
    let obj = {userId: isUser._id.toString(),
               token: token
              }
    return res.status(200).send({status:false, "message": "User login successfull", data:obj})
  }
  else {
    return res.status(401).send({status:false, message:"Invalid password!"});
  }
});
}

const getUser = async function (req, res) {
  try {
      let userId = req.params.userId;

      // var isValidId = mongoose.Types.ObjectId.isValid(userId)
      // if (!isValidId) return res.status(400).send({ status: false, message: "Enter valid user id" })
      let token = req.headers.authorization.slice(7)
      console.log(token)

      let saveData = await userModel.findById({ _id: userId }).select({ __v: 0})
      if (!saveData) { return res.status(404).send({ status: false, message: "user not found" }) }


      res.status(200).send({ status: true, message: "Success", data: saveData})
  } catch (err) {
      res.status(500).send({ message: 'Error', error: err.message });
  }
};

const updateUser= async function(req,res){
  let userId = req.params.userId
   let data = req.body

   const {fname,lname,email,phone,password} = data;

   if(!validator.isValidRequest(data))
   return res.status(400).send({status:false, msg:"Enter User Details To Update "}) //it should not be blank

   if(fname){
   if(!validator.isValidString(fname))
   return res.status(400).send({status:false, msg:"First Name Is Required "}) // it should be string

   if(!validator.isValidName(fname))
   return res.status(400).send({status:false, msg:"Enter Valid First Name "})
   }
    
   if(lname){
   if(!validator.isValidString(lname))
   return res.status(400).send({status:false, msg:"Last Name Is Required "}) // it should be string

   if(!validator.isValidName(lname))
   return res.status(400).send({status:false, msg:"Enter Valid Last Name "})
   }

   if(email){
   if(!validator.isValidString(email))
   return res.status(400).send({status:false, msg:"Email Is Required "}) // it should be string

   if(!validator.isValidEmail(email))
   return res.status(400).send({status:false, msg:"Email Is Not Valid "})

   const isDuplicate = await userModel.findOne({email:email})
   if(isDuplicate) return res.status(400).send({status:false, msg:` ${email} Already Exist`})
   }
  

   if(phone){
   if(!validator.isValidString(phone))
   return res.status(400).send({status:false, msg:" Phone Number is Required "})

   if(!validator.isValidMobile(phone))
   return res.status(400).send({status:false, msg:" Enter The Valid Number "})

   const isDuplicate = await userModel.findOne({phone:phone})
   if(isDuplicate) return res.status(400).send({status:false, msg:` ${phone} Already Exist`})
   }

   if(password){
   if(!validator.isValidString(password))
   return res.status(400).send({status:false, msg:"Password Is Required "})

   if(!validator.isValidPassword(password))
   return res.status(400).send({status:false, msg:" Password Must be Include One special_char,Uppercase,Lowercase and Number ,Min 8 & Max 15 Char Are Allowed"})
   
   const encryptPassword = await bcrypt.hash(password, 10)
        data.password = encryptPassword;
         
  }
   
  
  let profileImage=req.files
  if(profileImage){   
        // if(!validator.isValidImage(profileImage))
        // return res.status(400).send({status:false, msg:"Give valid Image File"})
     
        if(!(profileImage&&profileImage.length)) {
            return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });}
        const uploadedProfileImage = await uploadFile(profileImage[0])
        data.profileImage=uploadedProfileImage
        }  

    if(data.address){
        var parsedAddress = JSON.parse(data.address)
          console.log(parsedAddress)
          let {shipping,billing}=parsedAddress

          if(shipping.street){
          if(!validator.isValidString(shipping.street))
          return res.status(400).send({status:false, msg:"Street Is Required,should be in string value "})

          if(!validator.isvalidStreet(shipping.street))
          return res.status(400).send({status:false, msg:"Enter Valid Street"})
          }

          if(shipping.city){
          if(!validator.isValidString(shipping.city))
          return res.status(400).send({status:false, msg:"city Is Required,should be in string value "})

          if(!validator.isValidName(shipping.city))
          return res.status(400).send({status:false, msg:"Enter Valid city"})
          }

          if(shipping.pincode){
          if(!validator.isValidNumber(shipping.pincode))
          return res.status(400).send({status:false, msg:"Pincode should be numerical"})

          if(!validator.isvalidPincode(shipping.pincode))
          return res.status(400).send({status:false, msg:"Enter Valid Pincode "})
          }

          if(billing.street){
          if(!validator.isValidString(billing.street))
          return res.status(400).send({status:false, msg:"Street Is Required,should be in string value "})

          if(!validator.isvalidStreet(billing.street))
          return res.status(400).send({status:false, msg:"Enter Valid Street"})
          }

          if(billing.city){
          if(!validator.isValidString(billing.city))
          return res.status(400).send({status:false, msg:"city Is Required,should be in string value "})

          if(!validator.isValidName(billing.city))
          return res.status(400).send({status:false, msg:"Enter Valid city"})
          }

          if(billing.pincode){
          if(!validator.isValidNumber(billing.pincode))
          return res.status(400).send({status:false, msg:"Pincode should be numerical"})

          if(!validator.isvalidPincode(billing.pincode))
          return res.status(400).send({status:false, msg:"Enter Valid Pincode "})
          }

        }
        let updateData = await userModel.findByIdAndUpdate({_id:userId} ,data, {new:true})
        res.status(200).send({ status:true, message: "updated  Successfully" , data:updateData})
}

module.exports={createUser , loginUser , getUser , updateUser}

