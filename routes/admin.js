
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

        console.log(phoneNumbers)
        return
        var data = {
            "to":phoneNumbers,
            "from": "himalone",
            "sms": `Hello the  tracker installed in your keke or car  has expired. Kindly call himalone global service for the renewal of your tracking device 08060336194 or 08077971439`,
            "type": "plain",
            "api_key": process.env.TERMII_API_KEY,
            "channel": "generic",
        };
        var options = {
            'method': 'POST',
            'url': 'https://api.ng.termii.com/api/sms/send',
            'headers': {
                'Content-Type': ['application/json', 'application/json']
            },
            body: JSON.stringify(data)

        };
        request(options, function (error, response) {
            if (error) {
                console.log(error)
            }
            console.log(response.body);
        });

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
