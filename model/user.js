const mongoose = require('mongoose')

userSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String
})

module.exports = new mongoose.model('user',userSchema)