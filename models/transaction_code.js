let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var TransactionCode = new Schema({
    code: {
        type: Number
    },
    id_customer: {
        type: mongoose.Schema.ObjectId
    },
    cancel: {
    	type: Boolean
    },
    approval1: {
        type: Boolean
    },
    approval1_date :{
        type: Date, 
        default: Date.now 
    },
    approval2: {
        type: Boolean
    },
    approval2_date :{
        type: Date, 
        default: Date.now 
    },
    settlement: {
        type: Boolean
    },
    settlement_date :{
        type: Date, 
        default: Date.now 
    },
    total_amount: {
        type: Number
    },
    settlement_amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TransactionCode', TransactionCode);