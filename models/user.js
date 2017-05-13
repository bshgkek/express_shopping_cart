var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true }
});

// ecrypt a users pw
userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);	
};

// check if pw matches stored/hashed pw
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);	
};



module.exports = mongoose.model('User', userSchema);