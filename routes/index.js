var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');

router.get('/add-to-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product) {
		if(err) return res.redirect('/');
		cart.add(product, productId);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	});
});

router.get('/shopping-cart', function(req, res, next) {
	if(!req.session.cart) return res.render('shopping-cart', {products: null});
	var cart = new Cart(req.session.cart);
	res.render('shopping-cart', {
		products: cart.generateArray(),
		totalPrice: cart.totalPrice
	});
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

