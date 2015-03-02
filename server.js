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

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
}

var id = setInterval(function() {
  shapes.forEach(function(s) {
    s.x += Math.random()* 2 - 1;
    s.y += Math.random()* 2 - 1;
  });
  msg = {
    'text': 'Connected',
    'time': new Date(),
    'peers': peers,
    'shapes': shapes
  };
  wss.broadcast(JSON.stringify(msg), function() {
    
  });
}, 50);

wss.on('connection', function(ws) {
  peers += 1;
  ws.on('message', function(message) {
    var data = JSON.parse(message);
    shapes.push({
      'x': data.lat - beinecke[0] + 500,
      'y': data.lon - beinecke[1] + 250
    })
  });
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    //clearInterval(id);

  });
});
