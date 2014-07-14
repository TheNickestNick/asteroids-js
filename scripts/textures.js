define(function() {
  var paths = {
    rock1: 'rock1.jpg'
  };

  function loadTexture(context, name, path, callback) {
    var img = new Image();
    img.onerror = function() {
      console.error('Could not load texture: ' + path);
      textures[name] = 'orange';
      callback(false);
    };
    img.onload = function() {
      textures[name] = context.createPattern(name);
      callback(true);
    };
    img.src = path;
  }

  var textures =  {
    load: function(context, callback) {
      for (var name in paths) {
        loadTexture(context, name, paths[name], function() {
          toLoad--;
          if (toLoad === 0) {
            callaback();
          }
        });
      }
    },
  };

  var toLoad = 0;
  for (var k in paths) {
    toLoad++;
    textures[k] = 'purple';
  }

  return textures;
});
