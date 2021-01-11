let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

var Service = new Schema({
	code: {
		type: Number
	},
    name: {
        type: String
    },
    description: {
        type: String
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', Service);