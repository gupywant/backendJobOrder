let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var InvoiceNonreg = new Schema({
    id_invoice: {
        type: mongoose.Schema.ObjectId
    },
    id_code: {
        type: mongoose.Schema.ObjectId
    },
    po_ref: {
        type: String
    },
    qty: {
        type: Number,
        default: 0
    },
    total_amount: {
    	type: Number,
        default: 0
    },
    settlement: {
        type: Boolean
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InvoiceNonreg', InvoiceNonreg);