define(['./config', './graphics', './meshes', './input', './simulation'], 
    function(config, graphics, meshes, input, sim) {

  // TODO: we really need a way to separate the model data from the rendering.
  // I don't like that we have to expose everything via methods on simulation.
  function drawShip() {
    graphics.withContext(function(context) {
      // TODO: figure out a way to abstract these transformations
      context.translate(sim.ship.x(), sim.ship.y());
      context.rotate(sim.ship.rot());
    
      graphics.drawMesh(meshes.ship);

      if (sim.ship.thrust()) {
        graphics.drawMesh(meshes.thrust);
      }
    });
  }

  function drawBullets() {
    var bullets = sim.bullets();
    for (var i = 0; i < bullets.length; i++) {
      graphics.drawCircle(bullets[i].x, bullets[i].y, 2, 'white');
    }
  }

  function handleInput() {
    if (input.keyDown(input.keys.LEFT)) {
      sim.ship.rotate(-config.SHIP_ROTATE_SPEED);
    }
    
    if (input.keyDown(input.keys.RIGHT)) {
      sim.ship.rotate(config.SHIP_ROTATE_SPEED);
    }

    if (input.keyDown(input.keys.SPACE)) {
      sim.ship.shoot();
    }

    sim.ship.thrust(input.keyDown(input.keys.UP));
  }

  function drawFrame() {
    graphics.clear('black');
    drawShip();
    drawBullets();
  }

  (function main() {
    var debugConsole = document.createElement('div');
    debugConsole.style.width = '100%';
    debugConsole.style.wordWrap = 'break-word';

    window.requestAnimationFrame(function mainLoop(time) {
      if (!sim.started()) {
        sim.start(time);
      }

      handleInput();

      while (sim.time() + sim.SIM_DELTA_MS < time) {
        sim.step();
      }

      drawFrame();
      window.requestAnimationFrame(mainLoop);
    });

    var canvas = document.createElement('canvas');
    canvas.width = config.CANVAS_WIDTH;
    canvas.height = config.CANVAS_HEIGHT;
    document.body.appendChild(canvas);

    graphics.init(canvas);
    sim.init(canvas.width, canvas.height);
  })();

  return {
    start: function() {
    }
  };
}); // define
