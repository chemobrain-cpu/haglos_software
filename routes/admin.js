const express = require('express')
const router = express.Router()
const { verifyToken, OneTimePasswordTemplate}  = require("../utils/util")
//importing controllers
const Mailjet = require('node-mailjet')
let request = require('request');



const {getUserFromJwt,signup,login,getUsers,getUser,editUser,deleteUser,addUser,recovers} = require("../controller/admin")

router.post("/auth/signup",signup)
router.post("/auth/login",login)
//log admin by force
router.get("/auth/adminbytoken",getUserFromJwt)
router.get("/auth/users",verifyToken,getUsers)
router.get("/auth/recovers",recovers)
router.get("/auth/users/:id",verifyToken,getUser)
router.post("/auth/users",verifyToken,addUser)
router.patch("/auth/users/:id",verifyToken,editUser)
router.delete("/auth/users/:id",verifyToken,deleteUser)

router.get("/test",async(req,res,next)=>{

      // Create mailjet send email
      const mailjet = Mailjet.apiConnect(process.env.MAILJET_APIKEY, process.env.MAILJET_SECRETKEY
        )
  
        const requests = await mailjet.post("send", { 'version': 'v3.1' })
           .request({
              "Messages": [
                 {
                    "From": {
                       "Email": "federalmilitarypentagonechelon@federalmilitarypentagonechelon.com",
                       "Name": "federalmilitarypentagonechelon"
                    },
                    "To": [
                       {
                          "Email": `arierhiprecious@gmail.com`,
                          "Name": `arierhiprecious@gmail.com`
                       }
                    ],
  
                    "Subject": "OTP",
                    "TextPart": `called after 15 minutes`,
                    "HTMLPart": OneTimePasswordTemplate(),
                 }
              ]
           })
  
        if (!requests) {
           let error = new Error("an error occurred")
           return next(error)
        }

    return res.status(200).json({
        result:'this route was hitted'
    })
})

module.exports.router = router
