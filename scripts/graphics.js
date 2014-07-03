define(function() {
  var canvas = null;
  var context = null;

  return {
    init: function(canvas_) {
      canvas = canvas_;
      context = canvas.getContext('2d');
    },

    clear: function(style) {
      context.save();
      context.fillStyle = style;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
    },

    drawMesh: function(mesh) {
      context.save();
      context.beginPath();
      
      if (mesh.path && mesh.path.length > 0) {
        context.moveTo(mesh.path[0][0], mesh.path[0][1]);
        
        for (var i = 2; i < mesh.path.length; i++) {
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
    }
  };
});
