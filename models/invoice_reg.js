let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var InvoiceReg = new Schema({
    id_invoice: {
        type: mongoose.Schema.ObjectId
    },
    id_code: {
        type: mongoose.Schema.ObjectId
    },
    po_ref: {
        type: String
    },
    total_amount: {
    	type: Number,
        default: 0
    },
    settlement: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InvoiceReg', InvoiceReg);