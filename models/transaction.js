let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var Transaction = new Schema({
    id_transaction_vendor: {
        type: mongoose.Schema.ObjectId
    },
    id_service: {
        type: mongoose.Schema.ObjectId
    },
    qty: {
        type: Number,
        default: 0
    },
    planned_amount: {
    	type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', Transaction);