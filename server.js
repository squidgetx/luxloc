var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express();

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);

var peers = 0;

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  peers += 1;
  var id = setInterval(function() {
    msg = {
      'text': 'Connected',
      'time': new Date(),
      'peers': peers
    };
    ws.send(JSON.stringify(msg));
  }, 100);
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);

  });
});
