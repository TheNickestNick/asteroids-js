define(function() {
  var canvas = null;
  var context = null;

  return {
    init: function(canvas_) {
      canvas = canvas_;
      context = canvas.getContext('2d');

      // flip canvas so that (0, 0) is upper-left corner.
      context.translate(0, canvas.height);
      context.scale(1, -1);
    },

    clear: function(style) {
      context.save();
      context.fillStyle = style;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
    },

    drawMesh: function(mesh) {
      context.save();
    
      if (mesh.translate && mesh.translate.length > 1) {
        context.translate.apply(context, mesh.translate);
      }

      if (mesh.scale && mesh.scale.length > 1) {
        context.scale.apply(context, mesh.scale);
      }

      context.beginPath();
      
      if (mesh.path && mesh.path.length > 0) {
        context.moveTo(mesh.path[0][0], mesh.path[0][1]);
        
        for (var i = 1; i < mesh.path.length; i++) {
          context.lineTo(mesh.path[i][0], mesh.path[i][1]);
        }
      }

      context.closePath();

      if (mesh.type == 'fill') {
        context.fillStyle = mesh.style;
        context.fill();
      } else {
        context.strokeStyle = 'white';
        context.stroke();
      }

      context.restore();
    },

    withContext: function(callback) {
      context.save();
      callback(context);
      context.restore();
    },

    width: function() { return canvas.width; },
    height: function() { return canvas.height; }
  };
});
