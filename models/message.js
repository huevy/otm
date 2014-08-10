var mongoose = require('mongoose');
var uuid = require('node-uuid');


var Message = mongoose.model('Message', {
	_id: {
		type: String,
		default: uuid.v4.bind(uuid),
	},
	text: {
		type: String,
		required: true,
		validate: [valTextMaxLength, 'text is too long'],
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Message;


function valTextMaxLength(v) {
	return v && v.length <= 255;
}