define(['./config', './graphics', './meshes', './input', './game', './debug'], 
    function(config, graphics, meshes, input, Game, debug) {

  debug.define('skip_frames', 0);

  var game = null;
  var skipCounter = 0;
  function mainLoop(time) {
    window.requestAnimationFrame(mainLoop);


    if (debug.vars.skip_frames) {
      if (skipCounter > 0) {
        skipCounter--;
        return;
      }
      else {
        skipCounter = debug.vars.skip_frames;
      }
    }

    if (!game.started()) {
      game.start(time);
    }

    game.runUntil(time, input);

    if (game.needsToDraw()) {
      graphics.clear('black');
      game.draw(graphics);
    }
  }

  return {
    start: function() {
      var canvas = document.createElement('canvas');
      canvas.width = 1000; //config.CANVAS_WIDTH;
      canvas.height = canvas.width * (9/16); //config.CANVAS_HEIGHT;
      canvas.style.width = '100%';
      document.body.appendChild(canvas);

      game = new Game(canvas.width, canvas.height);
      
      console.log('Initializing input.');
      input.init(game);

      console.log('Initializing graphics.');
      graphics.init(canvas, function() {
        console.log('Starting game.');
        window.requestAnimationFrame(mainLoop);
      });
    }
  };
}); // define
