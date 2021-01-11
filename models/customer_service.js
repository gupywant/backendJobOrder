let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var CustomerService = new Schema({
    id_customer: {
        type: mongoose.Schema.ObjectId
    },
    id_service: {
        type: mongoose.Schema.ObjectId
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CustomerService', CustomerService);
