const mongoose = require('mongoose')

transactionSchema = new mongoose.Schema({
    name: String,
    category: String,
    amount: Number,
    createdAt: {type: Date, default: Date.now},
    transaction: {type: String, possibleValues: ['income','expense']},
    account: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    }]
})

module.exports = new mongoose.model('transac',transactionSchema)