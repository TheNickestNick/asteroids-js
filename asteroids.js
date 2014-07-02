var ship = { x: 0, y: 0, rot: 0, thrust: false, dx: 0, dy: 0 };

var keys = {};

var debugConsole = document.createElement('pre');

var renderingContext = null;

var frameTime = null;

var simTime = null;

var SIM_FPS = 20;
var SIM_DELTA_SEC = 1.0 / SIM_FPS;
var SIM_STEP_MS = 1000.0 / SIM_FPS;
var SHIP_WIDTH = 20;
var SHIP_LEN = 20;
var KEYS = { LEFT: 39, RIGHT: 37, UP: 38, DOWN: 40 }
var SHIP_ROT_SPEED = 2;

function updatePosition(entity) {
  entity.x += entity.dx;
  entity.y += entity.dy;
  
  // TODO: global width and height that aren't on canvas
  var w = renderingContext.canvas.width;
  var h = renderingContext.canvas.height;

  while (entity.x > w) { entity.x -= w; }
  while (entity.x < 0) { entity.x += w; } 
  while (entity.y > h) { entity.y -= h; }
  while (entity.y < 0) { entity.y += h; }
}

function resetGame(w, h) {
  ship.x = w / 2;
  ship.y = h / 2;
  ship.rot = 0;
}

function clearCanvas(ctx) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function path(ctx) {
  ctx.beginPath();
  ctx.moveTo(arguments[1][0], arguments[1][1]);
  for (var i = 2; i < arguments.length; i++) {
    ctx.lineTo(arguments[i][0], arguments[i][1]);
  }
  ctx.closePath();
}

function renderShip(ctx) {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.rot);
  ctx.translate(0, -SHIP_LEN*0.3);

  ctx.fillStyle = 'red';
  path(ctx, [0, SHIP_LEN], [-SHIP_WIDTH/2, 0], [SHIP_WIDTH/2, 0]);
  ctx.fill();

  if (ship.thrust) {
    ctx.fillStyle = 'yellow';
    path(ctx, [0, -SHIP_LEN/3], [-SHIP_WIDTH/4, 0], [SHIP_WIDTH/4, 0]);
    ctx.fill();
  }

  ctx.restore();
}

function updateSim() {
  if (keys[KEYS.LEFT]) {
    ship.rot -= SHIP_ROT_SPEED * SIM_DELTA_SEC;
  }
  
  if (keys[KEYS.RIGHT]) {
    ship.rot += SHIP_ROT_SPEED * SIM_DELTA_SEC;
  }

  ship.thrust = keys[KEYS.UP];
  
  if (ship.thrust) {
    ship.dy += Math.cos(ship.rot);
    ship.dx -= Math.sin(ship.rot);
  }

  updatePosition(ship);
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
    debugConsole.textContent += 'fps: ' + Math.round(1000 / delta) + '\n';
    debugConsole.textContent += 'ship: ' + JSON.stringify(ship);
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
