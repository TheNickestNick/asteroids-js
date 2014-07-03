define(['./config', './graphics', './meshes', './input', './simulation'], 
    function(config, graphics, meshes, input, sim) {

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

  function handleInput() {
    if (input.keyDown(input.keys.LEFT)) {
      ship.rot -= config.SHIP_ROTATE_SPEED * config.SIM_DELTA_SEC;
    }
    
    if (input.keyDown(input.keys.RIGHT)) {
      sim.ship.rot += config.SHIP_ROTATE_SPEED * config.SIM_DELTA_SEC;
    }

    if (input.keyDown(input.keys.SPACE)) {
      sim.ship.shoot();
    }

    ship.thrust(input.keyDown(input.keys.UP));
    
    if (sim.ship.thrust()) {
      ship.dy += Math.cos(ship.rot);
      ship.dx -= Math.sin(ship.rot);
    }

  }

  function update(time) {
    while (sim.time() + sim.SIM_STEP_MS < time) {
      sim.step();
    }

    graphics.clear('black');
    drawShip();
    drawBullets();
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
