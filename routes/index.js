var express = require('express');
var router = express.Router();

var Product = require('../models/product');


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

