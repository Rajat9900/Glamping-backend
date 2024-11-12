const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,  
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,  
    // required: true,
  },
  role : {
    type : String,
    required: true,
    enum: ["admin" , "manager" , "user"],
    default : "user"
  },
  activeUser: {
    type : Boolean,
    default : true 
  },
  resetToken: { 
    type: String 
  },
  resetTokenExpiration: {
     type: Date
     },
 
  dateOfBirth: {
    type: Date,
    required: false,
  }
},
{timestamps: true}
);

const User = mongoose.model('User', userSchema);

module.exports = User;