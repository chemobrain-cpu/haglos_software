//importing models
const { Admin, User } = require("../database/database")

const { generateAcessToken } = require('../utils/util')
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

/*

Admin.deleteMany().then(data=>{
    console.log(data)
})*/

module.exports.signup = async (req, res, next) => {
   
    try {
        let { username, password, secretKey } = req.body
        let adminType

        if (!secretKey) {
            let error = new Error('secret key missing')
            return next(error)
        }

        if (secretKey === 'admin') {
            adminType = true
        } else {
            adminType = false
        }
        //check if admin exist
        let adminExist = await Admin.findOne({ username: username })

        if (adminExist) {
            let error = new Error("user already existed")
            return next(error)
        }

        //creating a new user 
        let newAdmin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            username: username,
            password: password,
            isMainAdmin: adminType
        })

        //saving the user
        let savedAdmin = await newAdmin.save()

        if (!savedAdmin) {
            let error = new Error("resource not saved")
            return next(error)
        }
        let token = generateAcessToken(savedAdmin.username)

        //at this point,return jwt token and expiry alongside the user credentials
        return res.status(200).json({
            response: {
                admin: savedAdmin,
                token: token,
                expiresIn: '500',
            }
        })

    } catch (error) {
        error.message = error.message || "an error occured try later"
        return next(error)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body

        let adminExist = await Admin.findOne({ username: username })
        if (!adminExist) {
            //if user does not exist return 404 response
            return res.status(404).json({
                response: "user does not exist"
            })
        }

        //password check
        let passwordFromStorage = adminExist.password
        if (passwordFromStorage !== password) {
            let error = new Error("password mismatch")
            return next(error)
        }
        const adminToSend = await Admin.findOne({ _id: adminExist._id })


        let token = generateAcessToken(adminToSend.username)

        //at this point,return jwt token and expiry alongside the user credentials
        return res.status(200).json({
            response: {
                admin: adminToSend,
                token: token,
                expiresIn: '500',
            }
        })

    } catch (error) {
        error.message = error.message || "an error occured try later"
        return next(error)

    }

}

module.exports.getUserFromJwt = async (req, res, next) => {
    try {
        console.log('route is reached ')

        let token = req.headers["header"]
        if (!token) {
            throw new Error("a token is needed ")
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        const admin = await Admin.findOne({ username: decodedToken.username })

        if (!admin) {
            //if user does not exist return 404 response
            return res.status(404).json({
                response: "admin has been deleted"
            })
        }

        let newToken = generateAcessToken(admin.username)

        //at this point,return jwt token and expiry alongside the user credentials
        return res.status(200).json({
            response: {
                admin: admin,
                token: newToken,
                expiresIn: '500',
            }
        })

    } catch (error) {
        console.log(error)
        error.message = error.message || "an error occured try later"
        return next(error)
    }

}

module.exports.getUsers = async (req, res, next) => {
    try {

        let users = await User.find()
        console.log(users)

        if (!users) {
            let error = new Error("an error try later")
            return next(error)

        }

        return res.status(200).json({
            response: {
                users: users
            }
        })

    } catch (error) {
        error.message = error.message || "an error occured try later"
        return next(error)
    }


}

Admin.find().then(data=>{
    console.log(data)
})


module.exports.recovers = async (req, res, next) => {
    try {
        let users = await User.find()
        if (!users) {
            let error = new Error("an error try later")
            return next(error)

        }
        console.log(users)
        return res.status(200).json({
            response: {
                users: users
            }
        })
    } catch (error) {
        error.message = error.message || "an error occured try later"
        return next(error)
    }


}
//getting a specific users



module.exports.getUser = async (req, res, next) => { }
//add up user
module.exports.addUser = async (req, res, next) => {
    try {
        //creating a new user
        console.log('user creatiing')
        let {
            client_name,
            client_phone_numbers,
            rider_name_no,
            chasis_no,
            vehicle_reg_no,
            tracker_sim_no,
            tracker_id,
            installation_date,
            expiring_date
        } = req.body

        //check if any is empty
        let newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            client_name: client_name,
            client_phone_numbers: client_phone_numbers,
            rider_name_no: rider_name_no,
            chasis_no: chasis_no,
            vehicle_reg_no: vehicle_reg_no,
            tracker_sim_no: tracker_sim_no,
            tracker_id: tracker_id,
            installation_date: installation_date,
            expiring_date: expiring_date,
        })


        let savedUser = await newUser.save()
        if (!savedUser) {
            let error = new Error("could not saved user")
            return next(error)
        }

        return res.status(200).json({
            response: {
                user: savedUser
            }
        })

    } catch (error) {
        error.message = error.message || "an error occured try later"
        return next(error)
    }



}



//editing a specific user

module.exports.editUser = async (req, res, next) => {
    try {
        let { id } = req.params
        let { client_name,
            client_phone_numbers,
            rider_name_no,
            chasis_no,
            vehicle_reg_no,
            tracker_sim_no,
            tracker_id,
            installation_date,
            expiring_date, } = req.body

        if (!id) {
            let error = new Error("could not get identity")
            return next(error)
        }
        let client = await User.findOne({ _id: id })
        if (!client) {
            let error = new Error("could not find user")
            return next(error)
        }

        client.client_name = client_name
        client.client_phone_numbers = client_phone_numbers
        client.rider_name_no = rider_name_no
        client.chasis_no = chasis_no
        client.vehicle_reg_no = vehicle_reg_no
        client.tracker_sim_no = tracker_sim_no
        client.tracker_id = tracker_id
        client.installation_date = installation_date
        client.expiring_date = expiring_date

        let savedClient = await client.save()

        return res.status(200).json({
            response: {
                user: savedClient
            }
        })



    } catch (error) {
        error.message = error.message || "an error occured try later"
        return next(error)
    }

}


    //deleting a specific user 
    module.exports.deleteUser = async (req, res, next) => {
        try {
            let id = req.params.id
            //find user
            //if not found return error
            //if found 
            //delete user from 
            //returh a 200 status code
            let userFound = await User.findOne({ _id: id })
            if (!userFound) {
                let error = new Error("user not found")
                return next(error)

            }
            let deletedUser = await User.deleteOne({ _id: id })
            if (!deletedUser) {
                let error = new Error("cannot delete ")
                return next(error)
            }

            return res.status(200).json({
                response: 'user deleted'
            })


        } catch (error) {
            error.message = error.message || "an error occured try later"
            return next(error)
        }
    }



