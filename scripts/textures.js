define(['./graphics'], function() {
  function Texture(path) {
    this.path = path;  
  }

  Texture.prototype.load = function(graphics, callback) {
    var self = this;
    var img = new Image();
    img.onload = function() {
      self.pattern = graphics.createPattern(img);
      callback(true);
    };

    img.onerror = function() {
      callback(false);
    };
  };

  return {
    rock1: new Texture('rock1.jpg')
  };
});
