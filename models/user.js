let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var User = new Schema({
    companyId: {
        type: String,
        lowercase : true
    },
    email: {
        type: String,
        lowercase : true
    },
    password:{
        type: String
    },
    active: {
        type: Boolean
    },
    name: {
        type: String
    },
    department: {
        type: String
    },
    Role: {
        type: String
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', User);
