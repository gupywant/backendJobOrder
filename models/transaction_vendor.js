let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var TransactionVendor = new Schema({
    id_code: {
        type: mongoose.Schema.ObjectId
    },
    id_vendor: {
        type: mongoose.Schema.ObjectId
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TransactionVendor', TransactionVendor);