var express = require('express');
var hbs = require('hbs');
var googleapis = require('googleapis');

var CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'Enter you Google client id here'; 
var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'Enter you Google secret id here';; 
var APPLICATION_NAME = 'Nhde.js QuickStart';

var OAuth2Client = googleapis.OAuth2Client;
var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, 'postmessage');
var refreshToken;
var debug = require('debug')('google-plus-quickstart');

var client;
var app = express();

app.configure(function() {
    //view stuff
    app.set('views', __dirname );
    app.set('view engine', 'html');
    app.engine('html', hbs.__express);
    
    //middlewares
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'random-dummy-hash-507f1adcf4e665f0e3754b22912d67f4',  
        cookie: { 
            httpOnly: true, 
        //    secure: true 
        }
    }));
    app.use(express.csrf()); 

    //CSRF middleware to populate the token to the template vars
    app.use(function(req, res, next) {
        res.locals.STATE = req.session._csrf;
        next();
    });

    app.use(app.router); 
});

app.get('/', function(req, res) {
    res.render('index', {
        'CLIENT_ID': CLIENT_ID,
        'APPLICATION_NAME': APPLICATION_NAME
    });
 });

app.post('/connect', function(req, res){
    debug('/connect');
    var code = req.body.code;
    //5 Server exchanges one time code for access_token and id_token
    oauth2Client.getToken(code, function(err, tokens) {
        if(err) debug('Error' + err);
        req.session.googleTokens = tokens;
        //6 Google returns access_token and id_token
        //7 Server should confirm "Fully logged in" to Client
        res.send('Successfully connected with token: ' + tokens.access_token);
    });
});

app.get('/people', function(req, res) {
    var credentials = { 
        access_token: req.session.googleTokens.access_token,
        refresh_token: req.session.googleTokens.refresh_token
    };
    oauth2Client.credentials = credentials;
    client 
        .plus.people.list({ userId: 'me', collection: 'visible' })
        .withAuthClient(oauth2Client)
        .execute(function(err, data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });                    
            res.write(JSON.stringify(data));
            res.send();
        });
});

app.post('/disconnect', function(req, res) {
    var credentials = { 
        access_token: req.session.googleTokens.access_token,
        refresh_token: req.session.googleTokens.refresh_token
    };
    oauth2Client.credentials = credentials;
    req.session.destroy(function() {
        oauth2Client.revokeToken(credentials.access_token, function(err, data) {
            res.send('ok');
        });
    });
});

googleapis
    .discover('plus', 'v1')
    .execute(function(err, gPlusClient) {
        client = gPlusClient;
        app.listen(3000);
    });
