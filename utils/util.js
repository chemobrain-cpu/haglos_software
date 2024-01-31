const jwt = require("jsonwebtoken")
require("dotenv").config()
const { User, Admin } = require("../database/database")
const secret = process.env.SECRET_KEY

const { Expo } = require('expo-server-sdk');

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







