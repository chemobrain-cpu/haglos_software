const jwt = require("jsonwebtoken")
require("dotenv").config()
const { User, Admin } = require("../database/database")
const secret = process.env.SECRET_KEY




module.exports.generateAcessToken = (username) => {
    let token = jwt.sign({ username: username }, secret, { expiresIn: "500h" })
    return token
}

module.exports.verifyToken = async (req, res, next) => {
    //getting token from front-end rebook

    let token = req.headers["header"]
    try {
        if (!token) {
            throw new Error("a token is needed oh")
        }
        const decodedToken = jwt.verify(token, secret)
        let admin = await Admin.findOne({ username: decodedToken.username })

        if (!admin) {
            throw new Error('user not found')
        }
        req.admin = admin
        
        next()
    } catch (err) {
        let error = new Error("")
        error.statusCode = 302
        error.message = err.message
        return next(error)
    }
}

module.exports.OneTimePasswordTemplate = (password) => {
    return `
<div >
    <p style=" margin-bottom: 40px; width: 100%;text-align: center;font-size:1rem">You tracker has expired. Please do well to renew your tracker</p>

</div>`

}

module.exports.expireClient = (expiry)=>{
    var today = new Date();
    var nowYear = today.getFullYear();
    var nowMonth = today.getMonth();
    var nowDay = today.getDate();

    
    var expiry = new Date(parseInt(expiry.substring(0, 4)), parseInt(expiry.substring(5, 7)) - 1, parseInt(expiry.substring(8, 10)));

    var expiryYear = expiry.getFullYear();
    var expiryMonth = expiry.getMonth();
    var expiryDay = expiry.getDate();

    var compexpiry = expiryMonth.toString() + expiryDay.toString();
    var compToday = nowMonth.toString() + nowDay.toString();


    if (compexpiry == compToday) {
        return true
    }
    return false

  
}






