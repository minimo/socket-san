
/**
 * Module dependencies.
 */

var express = require('express');
var socketIO = require('socket.io');

var routes = require('./routes');
var auth = require('./routes/auth');
var world = require('./socket/world');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: 'daisecret'
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/id.js', routes.id);
app.get('/login', auth.login);
app.get('/callback', auth.callback);
app.get('/logout', auth.logout);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socketIO.listen(server, {'log level': 2});
io.on('connection', world.world);
world.init();
