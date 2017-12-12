const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/error',
    successRedirect: '/'
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;