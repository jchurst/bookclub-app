const mongoose = require('mongoose');
const BookSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now
	},
	_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	title: String,
	image: String
});
module.exports = mongoose.model('Book', BookSchema);