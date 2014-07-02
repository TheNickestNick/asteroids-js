var ship = {};

var keys = {};

var debugConsole = document.createElement('pre');

var canvas = null;

var frameTime = null;

var simTime = null;

var SIM_STEP_MS = (1000 / 20); // sim runs at 20fps

function performSimulationStep() {
}

function everyNSeconds(n, callback) {
  if (simTime % (n * 1000) < SIM_STEP_MS) {
    callback();
  }
}

function render(time, delta) {
  if (simTime == null) {
    simTime = time;
    return;
  }

  while (simTime + SIM_STEP_MS < time) {
    simTime += SIM_STEP_MS;
    performSimulationStep();
  }

  everyNSeconds(0.05, function() {
    debugConsole.textContent = 'keys: ' + JSON.stringify(keys) + '\n';
    debugConsole.textContent += 'delta: ' + delta + '\n';
    debugConsole.textContent += 'fps: ' + (1000 / delta);
  });
}


(function main() {
  document.body.addEventListener('keydown', function(event) {
    keys[event.which] = true;
  });

  document.body.addEventListener('keyup', function(event) {
    keys[event.which] = false;
  });

  var prevFrameTime = null;
  window.requestAnimationFrame(function renderLoop(time) {
    if (prevFrameTime == null) {
      prevFrameTime = time;
    }
    else {
      render(time, time - prevFrameTime);
      prevFrameTime = time;
    }
    window.requestAnimationFrame(renderLoop);
  });

  document.body.appendChild(debugConsole);
})();
