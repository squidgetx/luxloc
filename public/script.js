function updateStats(msg) {
  document.getElementById('status').innerHTML = msg.text;
  document.getElementById('time').innerHTML = msg.time;
  document.getElementById('peers').innerHTML = msg.peers;
}

var ws = new WebSocket('ws://localhost:8080');
ws.onmessage = function (event) {
  updateStats(JSON.parse(event.data));
};

