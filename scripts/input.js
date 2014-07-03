define(function() {
  var pressed = {};

  document.body.addEventListener('keydown', function(event) { 
    pressed[event.which] = true; 
  });
  
  document.body.addEventListener('keyup', function(event) { 
    pressed[event.which] = false; 
  });

  return {
    keyDown: function(key) {
      return !!pressed[key];
    },

    keys: {
      RIGHT: 37,
      UP: 38,
      LEFT: 39,
      DOWN: 40
    }
  }
});
