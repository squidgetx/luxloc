function updateStats(msg) {
  document.getElementById('status').innerHTML = msg.text;
  document.getElementById('time').innerHTML = msg.time;
  document.getElementById('peers').innerHTML = msg.peers;
}

var canvas, ctx;

document.addEventListener("DOMContentLoaded", function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
});

var ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function (event) {
  data = JSON.parse(event.data);
  updateStats(data);
  ctx.clearRect(0,0,150,150);
  ctx.fillStyle = 'red';
  data.shapes.forEach(function(s) {
    ctx.fillRect(s.x, s.y, 10, 10);
  });
  

};


