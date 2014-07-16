define(['./config', './graphics', './meshes', './input', './game'], 
    function(config, graphics, meshes, input, Game) {

  var game = null;

  // TODO: replacee this with a streaming command system
  function handleInput() {
    if (input.keyDown(input.keys.LEFT)) {
      game.ship.rotateLeft();
    }
    
    if (input.keyDown(input.keys.RIGHT)) {
      game.ship.rotateRight();
    }

    if (input.keyDown(input.keys.SPACE)) {
      game.shoot();
    }

    game.ship.engageThrust(input.keyDown(input.keys.UP));
  }

  return {
    start: function() {
      var canvas = document.createElement('canvas');
      canvas.width = 1000; //config.CANVAS_WIDTH;
      canvas.height = canvas.width * (9/16); //config.CANVAS_HEIGHT;
      canvas.style.width = '100%';
      document.body.appendChild(canvas);

      game = new Game(canvas.width, canvas.height);
      
      console.log('Initializing graphics.');
      graphics.init(canvas, function() {
        console.log('Starting game.');

        window.requestAnimationFrame(function mainLoop(time) {
          if (!game.started()) {
            game.start(time);
          }

          handleInput();
          game.runUntil(time, input);
          
          graphics.clear('black');
          game.draw(graphics);

          window.requestAnimationFrame(mainLoop);
        });
      });
    }
  };
}); // define
