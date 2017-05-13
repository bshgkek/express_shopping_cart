var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');

var csrfProtection = csurf();
router.use(csrfProtection);

// since checked by isLoggedIn, has to come before
// the notLoggedIn check, since it checks the rest of the routes
router.get('/profile', isLoggedIn, function(req, res, next) {
	res.render('user/profile');
});

router.get('/logout', isLoggedIn, function(req, res, next) {
	// logout added by passport
	req.logout()
	res.redirect('/');
});


router.use('/', notLoggedIn, function(req, res, next) {
	next();
});

router.get('/signup', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signin', passport.authenticate('local.signin', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}));






module.exports = router;

function isLoggedIn(req, res, next) {
	// isAuthenticated added by passport
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
function notLoggedIn(req, res, next) {
	// isAuthenticated added by passport
	if(!req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}