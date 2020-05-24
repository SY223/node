var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
var regModel = require('../models/learner');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const url = "mongodb://localhost:27017/caritas";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

router.use(session({
    secret: 'key',
    resave: true,
    saveUninitialized: true
}));

/* GET home page. */
router.get('/', function(req, res, next) {
	req.session.destroy();
  	res.render('index', { title: 'Caritas' });
});

router.get('/signup', function(req, res, next) {
 	res.render('signup', { title: 'Student Signup' });
});

router.post('/signup', function(req, res, next) {
	bcryptjs.genSalt(saltRounds, function(err, salt) {
	 	bcryptjs.hash(req.body.password, salt, function(err, hash) {
	 		const register = new regModel({
	 			username: req.body.username,
	 			firstname: req.body.firstname,
	 			lastname: req.body.lastname,
	 			city: req.body.city,
	 			state: req.body.state,
	 			email: req.body.email,
            	password: hash
	 		});
	 		register
            .save()
            .then(result=> {
            	res.redirect('home');
            })
            .catch(err=>{
            	Response.send("Error 505");
            });
	 	});
	});
});


router.get('/login', function(req, res,next) {
    res.render('login', { title: 'Login'});
});

router.post('/login', function(req, res, next) {
    regModel.findOne({email:req.body.email}).exec().then(result=>{
        if(bcryptjs.compareSync(req.body.password,result.password)){
            req.session.cust_log = "true";
            req.session.email = result.email;
            res.redirect('home'); //redirect 2 views
        }else{
            res.status(201).json({"error":"Wrong Password"});
        }
    }).catch(err=>{
        res.status(500).json({"error":"Wrong Password"});
    });
});

router.get('/home', function(req, res,next) {
    if(req.session.cust_log=="true"){
        res.render('home', { title: 'Welcome', email:req.session.email });
    }else {
    	res.render('login', { title: 'Login' });
    }  
});



module.exports = router;
