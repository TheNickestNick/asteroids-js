define(['./textures'], function(textures) {
  var canvas = null;
  var context = null;

  // TODO: maybe make this a stateless static class and pass a context around directly?
  return {
    init: function(canvas_, callback) {
      canvas = canvas_;
      context = canvas.getContext('2d');

      // preload all the textures
      textures.load(context, callback);
    },

    clear: function(style) {
      context.save();
      context.fillStyle = style;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
    },

    outlineCircle: function(x, y, r, style, width) {
      width = width || 1;
      context.save();
      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI);
      context.closePath();
      context.strokeStyle = style;
      context.lineWidth = width;
      context.stroke();
      context.restore();
    },

    fillBox: function(l, t, r, b, style) {
      context.save();
      context.fillStyle = style;
      context.fillRect(l, t, r - l, b - t);
      context.restore();
    },

    outlineBox: function(l, t, r, b, style) {
      context.save();
      context.beginPath();
      context.rect(l, t, r - l, b - t);
      context.closePath();
      context.strokeStyle = style;
      context.lineWidth = 2;
      context.stroke();
      context.restore();
    },

    withContext: function(callback) {
      context.save();
      callback(context);
      context.restore();
    },

    width: function() { return canvas.width; },
    height: function() { return canvas.height; },

    context: function() {
      return context;
    }
  };
});
