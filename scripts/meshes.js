// TODO: add support for more than just lineTo in paths.
define(function() {
  var Mesh = function() {
    this.type = 'fill';
    this.style = 'purple';
    this.translateX = 0;
    this.translateY = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotate = 0;
    this.path = [];
  };

  Mesh.prototype.draw = function(context, overrideStyle) {
    context.save();
    context.translate(this.translateX, this.translateY);
    context.rotate(this.rotate);
    context.scale(this.scaleX, this.scaleY);

    context.beginPath();
    
    for (var i = 0; i < this.path.length; i++) {
      if (i == 0) {
        context.moveTo(this.path[0][0], this.path[0][1]);
      }
      else {
        context.lineTo(this.path[i][0], this.path[i][1]);
      }
    }

    context.closePath();

    if (this.type == 'fill') {
      context.fillStyle = overrideStyle || this.style;
      context.fill();
    } else {
      context.strokeStyle = 'white';
      context.stroke();
    }

    context.restore();
  };

  var ship = new Mesh();
  ship.style = 'red';
  ship.translateY = -7;
  ship.scaleX = 1.2;
  ship.scaleY = 1.2;
  ship.path = [[0, 22], [-10, 0], [10, 0]];

  var thrust = new Mesh();
  thrust.style = 'yellow';
  thrust.translateY = -7;
  thrust.path = [[0, -5], [5, 0], [-5, 0]]

  return {
    ship: ship,
    thrust: thrust
  };
});
