const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  name:{
    type:String
  },
  passkey:{
    type:String
  },
  lastLogin: {
    type: Date,  
    default: null,
  }
})

const Admin = new mongoose.model('Admin',adminSchema)
module.exports = Admin