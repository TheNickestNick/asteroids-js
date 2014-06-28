var ship = {};

var keys = {};

var debugConsole = document.createElement('pre');

var canvas = null;

function render(delta) {
  debugConsole.textContent = 'keys: ' + JSON.stringify(keys) + '\n';
}


(function main() {
  document.body.addEventListener('keydown', function(event) {
    keys[event.which] = true;
  });

  document.body.addEventListener('keyup', function(event) {
    keys[event.which] = false;
  });

  window.requestAnimationFrame(function renderLoop(delta) {
    render(delta);
    window.requestAnimationFrame(renderLoop);
  });

  document.body.appendChild(debugConsole);
})();
