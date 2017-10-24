//dependencies 
const 	MongoClient	= require('mongodb').MongoClient,
		bodyParser	= require('body-parser'),
		express 	= require('express'),
		engines		= require('consolidate'),
		assert		= require('assert'),
		app 		= express();

//templates
app.engine('ejs', engines.ejs);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//bodyparser
app.use(bodyParser.urlencoded({extended: true}));



MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

	assert.equal(null, err);
	console.log('Successfully connected to MongoDB.');

	app.get("/", function(req, res) {
		db.collection('movies').find({}).toArray(function(err, docs) {
			console.log(docs);
			res.render('movies', { 'movies' : docs });
		});
	});

	app.get("/name/:id", function(req, res){
		let name = req.params.id;
		let var1 = req.query.var1;
		let var2 = req.query.var2;
		res.render('getPost', { name: name, var1: var1, var2: var2 });
	});

	app.get("/fav_color", function(req, res){
		const colors = ["red", "orange", "blue", "yellow", "green", "indigo"];
		res.render("fav_color", {colors: colors});
	});

	app.post("/fav_color", function(req, res, next){
		let favorite = req.body.fave;
		if (typeof favorite == 'undefined') {
			next(Error('Please choose a fruit!'));
		} else {
			res.send("Your favorite color is " + favorite);
		}
	});

	app.use(function(req, res){
		res.sendStatus(404);
	});

	const server = app.listen(3000, function() {
		const port = server.address().port;
		console.log('She\'s serving FACE, honey! On port %s', port);
	});

	app.use(function(err, req, res, next){
		console.error(err.message);
		console.error(err.stack);
		res.status(500);
		res.render('error', { error: err });
	});
});

