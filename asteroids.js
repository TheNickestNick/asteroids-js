var ship = { x: 0, y: 0, rot: 0 };

var keys = {};

var debugConsole = document.createElement('pre');

var renderingContext = null;

var frameTime = null;

var simTime = null;

var SIM_STEP_MS = (1000 / 20); // sim runs at 20fps
var SHIP_WIDTH = 20;
var SHIP_HEIGHT = 25;

function resetGame(w, h) {
  ship.x = w / 2;
  ship.y = h / 2;
  ship.rot = 0;
}

function clearCanvas(ctx) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function renderShip(ctx) {
  ctx.save();
  ctx.fillStyle = 'red';
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.rot);
  ctx.moveTo(0, SHIP_HEIGHT/2);
  ctx.beginPath();
  ctx.lineTo(-SHIP_WIDTH/2, -SHIP_HEIGHT/2);
  ctx.lineTo(SHIP_WIDTH/2, -SHIP_HEIGHT/2);
  ctx.lineTo(0, SHIP_HEIGHT/2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function updateSim() {
  
}

function everyNSeconds(n, callback) {
  if (simTime % (n * 1000) < SIM_STEP_MS) {
    callback();
  }
}

function renderFrame(ctx) {
  clearCanvas(ctx);
  renderShip(ctx);
}

function update(time, delta) {
  if (simTime == null) {
    simTime = time;
    return;
  }

  while (simTime + SIM_STEP_MS < time) {
    simTime += SIM_STEP_MS;
    updateSim();
  }

  renderFrame(renderingContext);

  everyNSeconds(0.05, function() {
    debugConsole.textContent = 'keys: ' + JSON.stringify(keys) + '\n';
    debugConsole.textContent += 'delta: ' + delta + '\n';
    debugConsole.textContent += 'fps: ' + Math.round(1000 / delta);
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
  window.requestAnimationFrame(function mainLoop(time) {
    if (prevFrameTime == null) {
      prevFrameTime = time;
    }
    else {
      update(time, time - prevFrameTime);
      prevFrameTime = time;
    }
    window.requestAnimationFrame(mainLoop);
  });

  var canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = canvas.width * (9/16);
  document.body.appendChild(canvas);
  renderingContext = canvas.getContext('2d');

  // flip canvas so that 0, 0 is upper left corner
  renderingContext.translate(0, canvas.height);
  renderingContext.scale(1, -1);

  document.body.appendChild(debugConsole);

  resetGame(canvas.width, canvas.height);
})();
