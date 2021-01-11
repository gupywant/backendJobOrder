let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

var Vendor = new Schema({
    code: {
        type: Number
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    npwp:{
        type: String
    },
    address: {
        type: String
    },
    province: {
        type: String
    },
    postalCode: {
        type: String
    },
    country: {
        type: String
    },
    attn: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vendor', Vendor);
