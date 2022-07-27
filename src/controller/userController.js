const bcrypt = require ('bcrypt');
const userModel=require("../models/userModel");
const mongoose=require("mongoose")
const validator=require("../validator/validation")
const {uploadFile} = require("../aws/awsConnect")


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


        let profileImage=req.files

        if(!(profileImage&&profileImage.length)) {
            return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });}
        const uploadedProfileImage = await uploadFile(profileImage[0])
        data.profileImage=uploadedProfileImage
        
      
      
        const userData= await userModel.create(data) //form
        res.status(201).send({status:true,msg:"user successfully created",data:userData})
}

module.exports.createUser=createUser