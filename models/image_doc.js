let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var ImageDoc = new Schema({
    id_code: {
        type: mongoose.Schema.ObjectId
    },
    doc1: {
        type: String,
        default: ''
    },
    doc2: {
        type: String,
        default: ''
    },
    pl1: {
        type: String,
        default: ''
    },
    pli2: {
        type: String,
        default: ''
    },
    csm1: {
        type: String,
        default: ''
    },
    csm2: {
        type: String,
        default: ''
    },
    csm3: {
        type: String,
        default: ''
    },
    csm4: {
        type: String,
        default: ''
    },
    rel1: {
        type: String,
        default: ''
    },
    rel2: {
        type: String,
        default: ''
    },
    stf1: {
        type: String,
        default: ''
    },
    stf2: {
        type: String,
        default: ''
    },
    yel1: {
        type: String,
        default: ''
    },
    yel2: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ImageDoc', ImageDoc);