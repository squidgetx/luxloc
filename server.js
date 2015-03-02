var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);
console.log('process listening on ' + port);

var peers = 0;

var shapes = [];

var beinecke = [41.311408, -72.927010];

var wss = new WebSocketServer({server: server});

wss.broadcast = function broadcast(data, error) {
  wss.clients.forEach(function each(client) {
    client.send(data, error);
  });
}

var animate = function() {
  shapes.forEach(function(s) {
    s.x += Math.random() - .5;
    s.y += Math.random() - .5;
  });
  msg = {
    'text': 'Connected',
    'time': new Date(),
    'peers': peers,
    'shapes': shapes
  };
  wss.broadcast(JSON.stringify(msg), function() {
    
  });
}

var id;

wss.on('connection', function(ws) {
  if (peers == 0) {
    id = setInterval(animate, 50);
    console.log('starting server interval');
  }
  peers += 1;
  ws.on('message', function(message) {
    var data = JSON.parse(message);
    var new_shape = {
      'x': (data.lon - beinecke[1])*30000 + 500,
      'y': (beinecke[0] - data.lat)*30000 + 250
    }
    shapes.push(new_shape);
    console.log(new_shape);
  });
  ws.on('close', function() {
    console.log('peer disconnected');
    peers --;
    if (peers == 0) {
      clearInterval(id);
      console.log('stopping server interval');
    }

  });
});
