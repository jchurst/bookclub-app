const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  
  twitter: {
    id: {
      type: Number,
      unique: true
    },
    token: String,
    username: String
  },
  
  firstname: String,
  lastname: String,
  city: String,
  state: String
  
});

module.exports = mongoose.model('User', UserSchema);