define(function() {
  // TODO: define this in a way that forward refernces to e.g., "textures.something" can be
  // used once textures are loaded. This will entail abstracting away the "fillStyle=pattern"
  // assignment using a method on the graphics class.
  var paths = {
    rock1: 'assets/rock1.jpg'
  };

  function loadTexture(context, name, path, callback) {
    console.log('Loading texture: ' + path);

    var img = new Image();
    img.onerror = function() {
      console.error('Could not load texture: ' + path);
      textures[name] = 'orange';
      callback(false);
    };
    img.onload = function() {
      console.log('Successfully loaded texture: ' + path);
      textures[name] = context.createPattern(img, 'repeat');
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
            callback();
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
