define(['./config'], function(config) {
  var ship = { x: 0, y: 0, rot: 0, thrust: false, dx: 0, dy: 0 };

  var keys = {};

  var renderingContext = null;

  var frameTime = null;

  var simTime = null;

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
    var SHIP_LEN = 22;
    var SHIP_WIDTH = 20;

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
    if (keys[config.KEYS.LEFT]) {
      ship.rot -= config.SHIP_ROTATE_SPEED * config.SIM_DELTA_SEC;
    }
    
    if (keys[config.KEYS.RIGHT]) {
      ship.rot += config.SHIP_ROTATE_SPEED * config.SIM_DELTA_SEC;
    }

    ship.thrust = keys[config.KEYS.UP];
    
    if (ship.thrust) {
      ship.dy += Math.cos(ship.rot);
      ship.dx -= Math.sin(ship.rot);
    }

    updatePosition(ship);
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

    while (simTime + config.SIM_DELTA_MS < time) {
      simTime += config.SIM_DELTA_MS;
      updateSim();
    }

    renderFrame(renderingContext);
  }

  function debugReplacer(key, val) {
    return (val && val.toFixed) ? Number(val.toFixed(3)) : val;
  };

  function getDebugString(delta) {
    return ['keys: ' + JSON.stringify(keys, debugReplacer),
        'delta: ' + delta, 
        'fps: ' + Math.round(1000 / delta),
        'ship: ' + JSON.stringify(ship, debugReplacer)
      ].join('<br/>');
  }


  (function main() {
    document.body.addEventListener('keydown', function(event) { keys[event.which] = true; });
    document.body.addEventListener('keyup', function(event) { keys[event.which] = false; });

    var debugConsole = document.createElement('div');
    debugConsole.style.width = '100%';
    debugConsole.style.wordWrap = 'break-word';

    var prevFrameTime = null;
    var prevDebugUpdate = 0;
    window.requestAnimationFrame(function mainLoop(time) {
      if (prevFrameTime == null) {
        prevFrameTime = time;
      }
      else {
        var delta = time - prevFrameTime;
        update(time, time - prevFrameTime);
        prevFrameTime = time;
      }

      if (time - prevDebugUpdate > 50) {
        prevDebugUpdate = time;
        debugConsole.innerHTML = getDebugString(delta);
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

  return {
    start: function() {
    }
  };
}); // define
