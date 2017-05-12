var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
	new Product({
		imagePath: '/images/snow-leopard.jpg',
		title: 'Snow Leopard',
		description: 'This is a snow leopard.',
		price: 10
	}),
	new Product({
		imagePath: '/images/jaguar.jpg',
		title: 'Jaguar',
		description: 'This is a jaguar.',
		price: 10
	}),
	new Product({
		imagePath: '/images/tiger.jpg',
		title: 'Tiger',
		description: 'This is a tiger.',
		price: 10
	}),
	new Product({
		imagePath: '/images/black-panther.jpg',
		title: 'Black Panther',
		description: 'This is a black panther.',
		price: 10
	}),
	new Product({
		imagePath: '/images/lion.jpg',
		title: 'Lion',
		description: 'This is a lion.',
		price: 10
	}),
	new Product({
		imagePath: '/images/cheetah.jpg',
		title: 'Cheetah',
		description: 'This is a cheetah.',
		price: 10
	}),
	new Product({
		imagePath: '/images/cougar.jpg',
		title: 'Cougar',
		description: 'This is a cougar.',
		price: 10
	})


]

var done = 0

for (var i = 0; i < products.length; i++) {
	products[i].save(function(err,res) {
		done++;
		if (done === products.length) {
			exit();
		}
	});
}

function exit() {
	mongoose.disconnect();
}

