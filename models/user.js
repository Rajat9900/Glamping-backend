const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
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
  userName: {
    type: String,
    unique: true, 
    sparse: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;




