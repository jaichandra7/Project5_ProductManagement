// to validate request
const isValidRequest = function(data){
        return Object.keys(data).length > 0
    }
    //to validate string
    const isValidString = function (value) {
        if (!value || value === undefined) return false
        if (typeof value !== "string" || value.trim().length === 0) return false
        return true
    }

    const isValidNumber = function (value) {
        if (!value || value === undefined) return false
        if (typeof value !== "number") return false
        return true
    }

    const isBoolean = function(value){
        if (!value || value === undefined) return false
        if (typeof value !== "boolean") return false
        return true
    }

    const isValidName = function(name){
    return /^[a-zA-Z]{2,20}$/.test(name.trim())
    }

    const isValidEmail = function(email){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())
    }

    const isValidMobile = function (mobile) {
        var phone = /^((\+91)?|91)?[6789][0-9]{9}$/;
        return phone.test(mobile);
    }
    
    const isValidPassword = function(password){
    return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(password.trim())
    }

    const isValidImage = function(profileImage){
    return /\.(jpe?g|png|gif|bmp)$/.test(profileImage) 
    }

    const isvalidStreet = function(street){
    return /\w*\s*|\w|\D/.test(street.trim())
    }

    const isvalidPincode = function(pincode){
    return /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(pincode)
    }

    const isValidPrice = function(price){
        return /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/.test(price)

    }

module.exports={isValidRequest, isValidString, isValidNumber, isValidName, isValidEmail, isValidMobile, isValidPassword, isValidImage, isvalidStreet, isvalidPincode, isValidPrice}