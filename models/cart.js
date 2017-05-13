module.exports = function Cart(oldCart) {
	// pass when adding new items to cart, make a new cart and return
	// pass an existing cart through the constructor, build new cart from that
	// return new cart

	this.items = oldCart.items || {};
	this.totalItems = oldCart.totalItems || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item, id) {
		var storedItem = this.items[id];
		if(!storedItem) {
			storedItem = this.items[id] = {item: item, quantity: 0, price: 0};
		}
		storedItem.quantity++;
		storedItem.price = storedItem.item.price * storedItem.quantity;
		this.totalItems++;
		this.totalPrice += storedItem.item.price;
	}

	this.generateArray = function() {
		var arr = [];
		for(var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	}


	this.remove	= function() {
		
	}
};