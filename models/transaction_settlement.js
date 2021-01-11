let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var TransactionSettlement = new Schema({
    id_code: {
        type: mongoose.Schema.ObjectId
    },
    id_service: {
        type: mongoose.Schema.ObjectId
    },
    id_vendor: {
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

module.exports = mongoose.model('TransactionSettlement', TransactionSettlement);