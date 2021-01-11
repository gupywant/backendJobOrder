let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var ApprovalSetting = new Schema({
    id_approval: {
        type: Number
    },
    id_user: {
        type: mongoose.Schema.ObjectId
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ApprovalSetting', ApprovalSetting);