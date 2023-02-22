const mongoose = require('mongoose')

accountSchema = new mongoose.Schema({
    name: String,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
})

module.exports = new mongoose.model('account',accountSchema)