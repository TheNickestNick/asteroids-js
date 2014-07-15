define(['./geometry'], function(geometry) {
  function Quadtree(left, top, w, h, depth) {
    this.aabb = new geometry.AABB(left, top, left + w, top + h);

    if (depth == 0) {
      this.objects = [];
    }
    else { 
      var childw = w/2;
      var childh = h/2;
      this.children = [
        new Quadtree(left, top, childw, childh, depth-1),
        new Quadtree(left+childw, top, childw, childh, depth-1),
        new Quadtree(left, top+childh, childw, childh, depth-1),
        new Quadtree(left+childw, top+childh, childw, childh, depth-1)
      ];
    }
  }

  Quadtree.prototype.clear = function() {
    if (this.objects) {
      this.objects = [];
    }

    this.eachChild(Quadtree.prototype.clear);
  };

  Quadtree.prototype.eachChild = function(func) {
    if (this.children) {
      for (var i = 0; i < this.children.length; i++) {
        func.apply(this.children[i], Array.prototype.slice.call(arguments, 1));
      }
    }
  };

  // TODO: can we just use bounding circles? Circle-box intersection isn't hard...
  Quadtree.prototype.add = function(object) {
    if (!this.aabb.intersectsCircle(object.x, object.y, object.boundingRadius)) {
      return;
    };

    if (this.objects) {
      this.objects.push(object);
    }
    
    this.eachChild(Quadtree.prototype.add, object);
  };

  // TODO: clean this up by making a debug package
  Quadtree.DEBUG_COLORS = ['red', 'green', 'blue', 'purple', 'orange', 'brown'];
  Quadtree.debugColor = function(i) {
    return Quadtree.DEBUG_COLORS[i % 6];
  };

  Quadtree.prototype.debugColor = function() {
    // knuth hash method
    var colori = ((this.aabb.l + this.aabb.r ^ this.aabb.b + this.aabb.t) * 1677216) % (1 << 24);
    return '#' + ('000000' + colori.toString(16)).substr(-6, 6);
  };

  Quadtree.prototype.draw = function(graphics) {
    var color = this.debugColor();
    this.aabb.draw(graphics, color, 1); 

    if (this.objects) {
      for (var i = 0; i < this.objects.length; i++) {
        var o = this.objects[i];
        graphics.drawCircle(o.x, o.y, o.boundingRadius, color, true);
      }
    }

    this.eachChild(Quadtree.prototype.draw, graphics);
  };

  return Quadtree;
});
