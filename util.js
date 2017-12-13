const Trade = require('./models/trade');
exports.attachUser = (req, res, next) => {
	res.locals.user = req.user;
	next();
};
exports.getNumTrades = (req, res, next) => {
	if (req.user) {
		Trade.find({
			_user2: req.user._id,
			isApproved: false
		}, (err, trades) => {
			if (err) throw err;
			res.locals.numTrades = trades.length || 0;
			next();
		});
	} else {
		next();
	}
};
exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
};