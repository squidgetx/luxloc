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

var ws = new WebSocket('ws://localhost:8080');

navigator.geolocation.getCurrentPosition(success, error, options);

ws.onmessage = function (event) {
  data = JSON.parse(event.data);
  updateStats(data);
  ctx.fillStyle = 'blue';
  ctx.fillRect(0,0,1000,500);
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

