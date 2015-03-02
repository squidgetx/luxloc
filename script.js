function updateStats(msg) {
  document.getElementById('status').innerHTML = msg.text;
  document.getElementById('time').innerHTML = msg.time;
  document.getElementById('peers').innerHTML = msg.peers;
}

var canvas, ctx;

document.addEventListener("DOMContentLoaded", function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = 'blue';
  ctx.fillRect(0,0,1000,500);
});

//var ws = new WebSocket('ws://localhost:8080');
var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

navigator.geolocation.getCurrentPosition(success, error, options);

var drawmap = function() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(0,0,1000,500);
  ctx.fillStyle = 'white';
  
  var beinecke = [41.311408, -72.927010];
  
  var buildings = [
  { 'name': 'beinecke',
    'lat': 41.311408,
    'lon': -72.927010
  },
  { 'name': 'morse',
    'lat': 41.312441,
    'lon': -72.930194
  },
  { 'name': 'silliman',
    'lat': 41.310902,
    'lon': -72.925120
  },
  { 'name': 'old campus',
    'lat': 41.309000,
    'lon': -72.928381
  },
  { 'name': 'ingalls rink',
    'lat': 41.316809,
    'lon': -72.924916
  }]

  buildings.forEach(function(b) {
    ctx.fillText(b.name, (b.lon - beinecke[1])*30000 + 500, 
        (beinecke[0]- b.lat)*30000 + 250);
  });

}

ws.onmessage = function (event) {
  data = JSON.parse(event.data);
  updateStats(data);
  drawmap();
  ctx.fillStyle = 'red';
  data.shapes.forEach(function(s) {
    ctx.fillRect(s.x, s.y, 10, 10);
  });
};

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;
  msg = {
    'lat': crd.latitude,
    'lon': crd.longitude,
    'acc': crd.accuracy
  };
  ws.send(JSON.stringify(msg));
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

var getLoc = function() {
  navigator.geolocation.getCurrentPosition(success, error, options);
}

