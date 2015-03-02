var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express();

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);

var peers = 0;

var shapes = [];

var wss = new WebSocketServer({server: server});

wss.on('connection', function(ws) {
  peers += 1;
  shapes.push({
    'x': 10*peers,
    'y': 10*peers
  });
  var id = setInterval(function() {
    shapes.forEach(function(s) {
      s.x += 1;
    });
    msg = {
      'text': 'Connected',
      'time': new Date(),
      'peers': peers,
      'shapes': shapes
    };
    ws.send(JSON.stringify(msg));
  }, 100);
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);

  });
});
