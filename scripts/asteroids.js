define(['./config', './graphics', './meshes', './input', './game', './debug', './audio'], 
    function(config, graphics, meshes, input, Game, debug, audio) {

  debug.define('skip_frames', 0);

  var game = null;
  var skipCounter = 0;
  function mainLoop(time) {
    window.requestAnimationFrame(mainLoop);


    if (asteroids.skip_frames) {
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
      canvas.height = 1000; //canvas.width * (9/16); //config.CANVAS_HEIGHT;
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      document.body.appendChild(canvas);

      game = new Game(canvas.width, canvas.height);
      
      console.log('Initializing input.');
      input.init(game);

      // TODO: make these inits happen concurrently
      console.log('Initializing graphics.');
      graphics.init(canvas, function() {
        console.log('Graphics: Initialized');
        console.log('Audio: Initializing');
        audio.init(function() {
          console.log('Audio: Initialized');
          console.log('Starting game.');
          window.requestAnimationFrame(mainLoop);
        });
      });
    }
  };
}); // define
