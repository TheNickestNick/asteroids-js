define(function() {
  return {
    wrappable: {
      wrap: function(w, h) {
        while (this.x > w) { this.x -= w; }
        while (this.x < 0) { this.x += w; }
        while (this.y > h) { this.y -= h; }
        while (this.y < 0) { this.y += h; }
      }
    },

    movesWithVelocity: {
      update: function() {
        this.x += this.velx;
        this.y += this.vely;
      }
    },

    hasTTLof: function(ttl) {
      return {
        init: function() {
          this.ttl = ttl;
        },

        isAlive: function() {
          return this.ttl > 0;
        },

        update: function() {
          this.ttl--;
        }
      };
    },
  };
});
