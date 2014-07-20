define(['./geometry'], function(geometry) {
  // TODO: maybe keep leaves in a big array, so they can be cleared really easily? This
  // might also make it easier to update the tree rather than rebuilding it.
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

  Quadtree.prototype.rebuild = function(objects) {
    this.clear();
    for (var i = 0; i < objects.length; i++) {
      this.add(objects[i]);
    }
  };

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

  Quadtree.prototype.add = function(object) {
    if (!this.aabb.intersectsCircle(object.x, object.y, object.boundingRadius)) {
      return;
    };

    if (this.objects) {
      this.objects.push(object);
    }
    
    this.eachChild(Quadtree.prototype.add, object);
  };

  Quadtree.prototype.findFirstIsecWithPoint = function(x, y) {
    if (!this.aabb.containsPoint(x, y)) {
      return null;
    }
  
    if (this.children) {
      for (var i = 0; i < this.children.length; i++) {
        var result = this.children[i].findFirstIsecWithPoint(x, y);
        if (result && !result.isDead()) {
          return result;
        }
      }
    }

    if (this.objects) {
      for (var i = 0; i < this.objects.length; i++) {
        var o = this.objects[i];
        // TODO: should Entity contain bounds checking logic like this?
        if (geometry.circleContainsPoint(o.x, o.y, o.boundingRadius, x, y)) {
          return o;
        }
      }
    }

    return null;
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
    var offset = 0;
    graphics.fillBox(this.aabb.l + offset, 
                     this.aabb.t + offset, 
                     this.aabb.r - 2*offset, 
                     this.aabb.b - 2*offset, color);

    this.eachChild(Quadtree.prototype.draw, graphics);

    if (this.objects) {
      for (var i = 0; i < this.objects.length; i++) {
        var o = this.objects[i];
        graphics.drawCircle(o.x, o.y, o.boundingRadius, color, true);
      }
    }
  };

  return Quadtree;
});
