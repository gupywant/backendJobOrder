let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var Invoice = new Schema({
    id_customer: {
        type: mongoose.Schema.ObjectId
    },
    code: {
        type: Number
    },
    type: {
        type: Number,
        default: 1
    },
    ppn: {
        type: Number,
        default: 0
    },
    pph: {
        type: Number,
        default: 0
    },
    total_amount: {
    	type: Number,
        default: 0
    },
    cancel: {
        type: Boolean,
        default: false
    },
    settlement_date: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', Invoice);