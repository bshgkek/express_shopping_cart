var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');

var Product = require('../models/product');

var csrfProtection = csurf();
router.use(csrfProtection);



router.get('/user/signup', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signup', passport.authenticate('local-signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/user/signin', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signin', passport.authenticate('local.signin', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

router.get('/user/profile', function(req, res, next) {
	res.render('user/profile');
});



/* GET home page */
router.get('/', (req, res, next) => {
	var products = Product.find(function (err, docs) {
		res.render('shop/index', { title: 'Shopping Cart', products: docs});
	});
});


/* 404 PAGE */
router.use(function(req, res, next) {
	res.type('text/html');
	res.status(404);
	res.render('404');
});


/* 500 PAGE */
router.use(function(err, req, res, next) {
	console.log(err.stack);
	res.type('text/html');
	res.status(500);
	res.render('500');
});


module.exports = router;

