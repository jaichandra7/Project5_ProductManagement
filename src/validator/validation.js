// To Validate Empty request
const isValidRequest = function(data){
        return Object.keys(data).length > 0
    }
    //To Validate String
    const isValidString = function (value) {
        if (!value || value === undefined) return false
        if (typeof value !== "string" || value.trim().length === 0) return false
        return true
    }

    // To Validate Numbers In Object
    const isValidNumbers=  function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
    
    // To Validate Numbers
    const isValidNumber = function (value) {
        if (!value || value === undefined) return false
        if (typeof value !== "number") return false
        return true
    }

    // To Validate Boolean
    function isBoolean(val)
    {
        if (typeof val === 'string' && val === 'true'  )
            return true;
        else if (typeof val === 'string' && val === 'false'  )
         return true;
     
        return false;
    }
    
    // To Validate Name
    const isValidName = function(name){
    return /^[a-zA-Z]{2,20}$/.test(name.trim())
    }

    // To Validate Title
    const isValidTitle = function(title){
        return /^[a-zA-Z\s$]{2,30}$/.test(title.trim())
        }

    // To Validate Email
    const isValidEmail = function(email){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    }

    // To Validate Mobile Number
    const isValidMobile = function (mobile) {
        var phone = /^((\+91)?|91)?[6789][0-9]{9}$/;
        return phone.test(mobile);
    }
    
    // To Validate Password
    const isValidPassword = function(password){
    return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(password.trim())
    }

    // To Validate Image
    const isValidImage = function(profileImage){
     return /([/|.|\w|\s|-])*\.(?:jpg|gif|png|bmp|jpeg|webp|tiff)/.test(profileImage)
    }

    // To Validate Street
    const isValidStreet = function(street){
    return /\w*\s*|\w|\D/.test(street.trim())
    }

    // To Validate Pincode
    const isValidPincode = function(pincode){
    return /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(pincode)
    }

    // To Validate Price
    const isValidPrice = function(price){
        return /\d{1,3}(?:[,]\d{3})*(?:[.]\d{0,2})?|\d{1,3}(?:[ ]\d{3})*(?:[,]\d{0,2})?/.test(price)
     }

    // To Validate Size
    const isValidSize =function(size) {
     const validSize = size.split(",").map(x => x.toUpperCase().trim())
        let givenSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]      
        for (let i = 0; i < validSize.length; i++) {
          if (!givenSizes.includes(validSize[i])) {
            return false
          }
        }
        return validSize
      }
    

module.exports={isValidRequest, isValidString, isValidNumber, isValidNumbers, isValidName, isValidTitle, isValidEmail, isValidMobile, isValidPassword, isValidImage,  isValidStreet, isValidPincode, isValidPrice,isBoolean, isValidSize}