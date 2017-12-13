const mongoose = require('mongoose');
const TradeSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now
	},
	_book1: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Book'
	},
	_book2: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Book'
	},
	_user1: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	_user2: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	isApproved: {
		type: Boolean,
		default: false
	}
});
module.exports = mongoose.model('Trade', TradeSchema);