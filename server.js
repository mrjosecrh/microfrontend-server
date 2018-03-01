var express = require('express');
var app = express();
var path = require('path');
var session = require('express-session');
var uuid = require('uuid');
var passportAutoconfigurator = require('passport-autoconfigurator');
var config = require('./application.json');
var port = process.env.PORT || 8080;

app.use(session({
	secret: uuid.v4(),
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: (45 * 60 * 1000)
	}
}));

var googlePasssport = new passportAutoconfigurator.GooglePassportAutoconfigurator(config.oauth,app);

// data to send from server to client
app.post('/configuration', function(req, res) {
  
  var configuration = {
    "tokenTwitter": "123456789",
    "routesByUser": "/admin, /managment, /data",
		"notification": "System is currently down ...",
		"anyKey" : "anyValue"
  };  
  
  res.json(configuration);
});

var ensureGoogleAuthenticated = function (req, res, next) {
  googlePasssport.ensureAuthenticated(req, res, next);
};

app.use(ensureGoogleAuthenticated);

/* serves main page */
app.get("/", function(req, res) {
   res.sendFile(__dirname+"/deployed-web"+'/index.html')
});

/* serve rest of web assets*/
app.use('/', express.static(__dirname+"/deployed-web"));

// start server
app.listen(port, function() {
    console.log('App is running on');
});
