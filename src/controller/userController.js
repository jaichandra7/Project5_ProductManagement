const bcrypt = require ('bcrypt');
const userModel=require("../models/userModel");
const mongoose=require("mongoose")
const validator=require("../validator/validation")
const {uploadFile} = require("../aws/awsConnect")


const createUser=async function (req,res){
        const data=req.body
        const {fname,lname,email,phone,password} = data;

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
    

       
        // if(!validator.isValidImage(profileImage))
        // return res.status(400).send({status:false, msg:"Give valid Image File"})


      
        if(!(profileImage&&profileImage.length)) {
            return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });}
        const uploadedProfileImage = await uploadFile(profileImage[0])
        data.profileImage=uploadedProfileImage
        
        // if(!data.address)
        // return res.status(400).send
        let address = data.address
        address = JSON.parse(address)
        if(address) {
                
        //  let { shipping, billing}=address

        if(!validator.isValidString(address.shipping.street || address.billing.street ))
        return res.status(400).send({status:false, msg:"Street Name Is Required "})

        if(!validator.isvalidStreet(address.shipping.street || address.billing.street))
        return res.status(400).send({status:false, msg:"Street Name Is Invalid "})

        if(!validator.isValidString(address.shipping.city || address.billing.city))
        return res.status(400).send({status:false, msg:"City Is Required "}) // it should be string

        if(!validator.isValidName(address.shipping.city || address.billing.city))
        return res.status(400).send({status:false, msg:"Enter Valid City "})

        // if(!validator.isValidNumber(address.shipping.pincode || address.billing.pincode))
        // return res.status(400).send({status:false, msg:"Pincode should be in Numbers"})
        let pincode = address.shipping.pincode.toString()
        if(!validator.isvalidPincode(address.shipping.pincode || address.billing.pincode))
        return res.status(400).send({status:false, msg:"Enter Valid Pincode"})

        // let { bStreet,bCity,bPincode}=address.billing

        // if(!validator.isValidString(bStreet))
        // return res.status(400).send({status:false, msg:"Street Name Is Required "})

        // if(!validator.isvalidStreet(bStreet))
        // return res.status(400).send({status:false, msg:"Street Name Is Invalid "})

        // if(!validator.isValidString(bCity))
        // return res.status(400).send({status:false, msg:"City Is Required "}) // it should be string

        // if(!validator.isValidName(bCity))
        // return res.status(400).send({status:false, msg:"Enter Valid City "})

        // if(!validator.isValidNumber(bPincode))
        // return res.status(400).send({status:false, msg:"Pincode should be in Numbers"})

        // if(!validator.isvalidPincode(bPincode))
        // return res.status(400).send({status:false, msg:"Enter Valid Pincode"})

        
        }
      const userDetails =  { fname: fname, lname: lname, profileImage: data.profileImage, email: email, phone: phone, password: data.password, address: address }

        const userData= await userModel.create(data) //form
        res.status(201).send({status:true,msg:"user successfully created",data:userData})
}

module.exports.createUser=createUser