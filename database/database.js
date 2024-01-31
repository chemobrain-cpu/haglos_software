const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true
    },
    
    password: {
        type: String,
        required: true
    },
    isMainAdmin:{
        type:Boolean,
        required:true
    }
})



const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    client_name: {
        type: String,
    },
    client_phone_numbers: {
        type: String,
    },
    rider_name_no: {
        type: String,
    },
    chasis_no: {
        type: String,
    },
    vehicle_reg_no: {
        type: String,
    },
    tracker_sim_no: {
        type: String,
    },
    tracker_id: {
        type: String,
    },
    installation_date: {
        type: String,
    },
    expiring_date: {
        type: String,
    },
    
})


module.exports.User = mongoose.model("User", UserSchema)

module.exports.Admin = mongoose.model("Admin", AdminSchema)
