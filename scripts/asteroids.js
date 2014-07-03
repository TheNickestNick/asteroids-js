define(['./config', './graphics', './meshes', './input'], 
    function(config, graphics, meshes, input) {
  // TODO: create a "models" module with Ship and Game class
  // TODO: create a module for handling game loop and timing
  var ship = { x: 0, y: 0, rot: 0, thrust: false, dx: 0, dy: 0, lastShot: 0 };
  var bullets = [];

  var simTime = null;

  function updatePosition(entity) {
    entity.x += entity.dx;
    entity.y += entity.dy;
    
    // TODO: global width and height that aren't on canvas
    var w = config.CANVAS_WIDTH;
    var h = config.CANVAS_HEIGHT;

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

  function path(ctx) {
    ctx.beginPath();
    ctx.moveTo(arguments[1][0], arguments[1][1]);
    for (var i = 2; i < arguments.length; i++) {
      ctx.lineTo(arguments[i][0], arguments[i][1]);
    }
    ctx.closePath();
  }

  function drawShip() {
    graphics.withContext(function(context) {
      // TODO: figure out a way to abstract these transformations
      context.translate(ship.x, ship.y);
      context.rotate(ship.rot);
    
      graphics.drawMesh(meshes.ship);

      if (ship.thrust) {
        graphics.drawMesh(meshes.thrust);
      }
    });
  }

  function drawBullets() {
    for (var i = 0; i < bullets.length; i++) {
      graphics.drawCircle(bullets[i].x, bullets[i].y, 2, 'white');
    }
  }

  function shoot() {
    if (simTime - ship.lastShot > config.SHIP_SHOOT_DELAY_MS) {
      ship.lastShot = simTime;
      bullets.push({
        x: ship.x, y: ship.y,
        dx: ship.dx - Math.sin(ship.rot) * config.BULLET_VELOCITY,
        dy: ship.dy + Math.cos(ship.rot) * config.BULLET_VELOCITY,
        born: simTime
      });
    }
  }

  function updateSim() {
    if (input.keyDown(input.keys.LEFT)) {
      ship.rot -= config.SHIP_ROTATE_SPEED * config.SIM_DELTA_SEC;
    }
    
    if (input.keyDown(input.keys.RIGHT)) {
      ship.rot += config.SHIP_ROTATE_SPEED * config.SIM_DELTA_SEC;
    }

    if (input.keyDown(input.keys.SPACE)) {
      shoot();
    }

    ship.thrust = input.keyDown(input.keys.UP);
    
    if (ship.thrust) {
      ship.dy += Math.cos(ship.rot);
      ship.dx -= Math.sin(ship.rot);
    }

    updatePosition(ship);

    for (var i = 0; i < bullets.length; i++) {
      var b = bullets[i];
      updatePosition(b);

      if (simTime > b.born + config.BULLET_TTL_MS) {
        bullets.splice(i, 1);
        i--;
      }
    }
  }

  function renderFrame() {
    graphics.clear('black');
    drawShip();
    drawBullets();
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

    renderFrame();
  }

  (function main() {
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

      window.requestAnimationFrame(mainLoop);
    });

    var canvas = document.createElement('canvas');
    canvas.width = config.CANVAS_WIDTH;
    canvas.height = config.CANVAS_HEIGHT;
    document.body.appendChild(canvas);
    graphics.init(canvas);

    document.body.appendChild(debugConsole);

    resetGame(canvas.width, canvas.height);
  })();

  return {
    start: function() {
    }
  };
}); // define
