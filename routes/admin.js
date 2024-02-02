
const express = require('express')
const router = express.Router()
const { verifyToken, OneTimePasswordTemplate, expireClient } = require("../utils/util")
//importing controllers
const Mailjet = require('node-mailjet')
let request = require('request');

const { getUserFromJwt, signup, login, getUsers, getUser, editUser, deleteUser, addUser, recovers } = require("../controller/admin");
const { User } = require('../database/database');

router.post("/auth/signup", signup)
router.post("/auth/login", login)
//log admin by force
router.get("/auth/adminbytoken", getUserFromJwt)
router.get("/auth/users", verifyToken, getUsers)
router.get("/auth/recovers", recovers)
router.get("/auth/users/:id", verifyToken, getUser)
router.post("/auth/users", verifyToken, addUser)
router.patch("/auth/users/:id", verifyToken, editUser)
router.delete("/auth/users/:id", verifyToken, deleteUser)

User.find().then(data => {
    console.log(data)
})
router.get("/test", async (req, res, next) => {
    try {
        let users = await User.find()
        if (!users) {
            return res.status(404).json({
                result: 'no users yet'
            })
        }

        //go through all user and get those who just expired
        let expiredCollection = users.filter(data => {
            if (expireClient(data.installation_date)) {
                return data
            }
        })

        // a loop to asynchronously change the isExpire property to true

        for (let data of expiredCollection) {
            ////////////////data !!!!!!
            data.isExpire = true
            await data.save()
        }

        //get all expiried user again and send sms 
        let expiredUsers = users.filter(data => data.isExpire === true)

        //get all phone numbers of client 
        let phoneNumbers = expiredUsers.map(data => {
            return data.client_phone_numbers
        })

        // an sms API that sends bulk sms
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
        // algorithm to message client and admin of an expire package
        return res.status(200).json({
            result: phoneNumbers
        })

    } catch (err) {
        console.log(err)
        return res.status(200).json({
            result: 'this route was hitted'
        })

    }


})

module.exports.router = router
