// if passport required in 2 files, it uses same instance, doesnt create 2 instances
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

// how to store user in the session
passport.serializeUser(function(user, done) {
	// serialize users by id
	// first parameter of done() is the error case, no error, its null
	done(null, user.id);	
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		// first parameter of done() is the error case
		done(err, user);
	});
});

passport.use('local-signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) {
	// checkBody provided by express-validator, provide field to validate, chain validations
	req.checkBody('email','Invalid email').notEmpty().isEmail();
	req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
	// again, express-validator adds this method to a request and returns errors based on 
	// validations created (for ex, the ones above)
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach(function(error) {
			// each error has parent field, for which parameter threw the error
			// and a msg field describing the error
			messages.push(error.msg)
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user) {
		if(err) return done(err);
		// null error case bc no real error, email already in use so user arg is false
		// message is stored from flash under error, called with "var messages = req.flash('error');"
		if(user) return done(null, false, {message: 'Email already in use.'});

		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.save(function(err, result) {
			if(err) return done(err);
			return done(null, newUser)
		});

	});
}));

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done) { 
	req.checkBody('email','Invalid email or password.').notEmpty().isEmail();
	req.checkBody('password','Invalid email or password.').notEmpty();
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg)
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user) {
		if(err) {
			return done(err);
		}
		if(!user) {
			return done(null, false, {message: 'Invalid email or password.'});
		}
		if(!user.validPassword()) {
			return done(null, false, {message: 'Invalid email or password.'});
		}
		return done(null, user);
	});
}));