define(['./config'], function(config) {
  // TODO: create a "models" module with Ship and Game class
  var ship = { x: 0, y: 0, rot: 0, thrust: false, dx: 0, dy: 0, lastShot: 0 };
  var bullets = [];
  var time = null;
  var width = null;
  var height = null;

  var SIM_DELTA_SEC = 1.0 / 20;
  var SIM_DELTA_MS = 1000.0 / 20;

  function updatePosition(entity) {
    entity.x += entity.dx;
    entity.y += entity.dy;
    
    while (entity.x > width) { entity.x -= width; }
    while (entity.x < 0) { entity.x += width; } 
    while (entity.y > height) { entity.y -= height; }
    while (entity.y < 0) { entity.y += height; }
  }

  function updateBullets() {
    for (var i = 0; i < bullets.length; i++) {
      var b = bullets[i];
      updatePosition(b);

      if (time > b.born + config.BULLET_TTL_MS) {
        bullets.splice(i, 1);
        i--;
      }
    }
  }

  return {
    SIM_DELTA_MS: 1000.0 / 20, // sim runs at 20fps

    time: function() { return time; },
    started: function() { return time != null; },
    width: function() { return width; },
    height: function() { return height; },

    start: function(realTime) {
      time = realTime;
    },

    init: function(w, h) {
      width = w;
      height = h;

      ship.x = w / 2;
      ship.y = h / 2;
      ship.rot = 0;
    },

    run: function(realTime) {
      while (time + SIM_DELTA_MS < realTime) {
        step();
      }
    },

    step: function() {
      if (ship.thrust) {
        ship.dy += Math.cos(ship.rot);
        ship.dx -= Math.sin(ship.rot);
      }
      
      updatePosition(ship);
      updateBullets();

      time += SIM_DELTA_MS;
    },

    bullets: function() {
      return bullets;
    },

    ship: {
      x: function() { return ship.x; },
      y: function() { return ship.y; },
      rot: function() { return ship.rot; },

      rotate: function(speed) {
        ship.rot += speed * SIM_DELTA_SEC;
      },

      shoot: function() {
        if (time - ship.lastShot > config.SHIP_SHOOT_DELAY_MS) {
          ship.lastShot = time;
          bullets.push({
            x: ship.x, y: ship.y,
            dx: ship.dx - Math.sin(ship.rot) * config.BULLET_VELOCITY,
            dy: ship.dy + Math.cos(ship.rot) * config.BULLET_VELOCITY,
            born: time 
          });
        }
      },

      thrust: function(on) {
        if (typeof on !== 'undefined') {
          ship.thrust = on;
        }
        return ship.thrust;
      }
    }
  };
});
