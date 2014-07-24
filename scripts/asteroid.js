define(['./entity','./textures', './utils', './gfx', './bonus'], 
    function(Entity, textures, utils, gfx, Bonus) {
  var asteroidTextures = ['rock1', 'rock2', 'rock3', 'rock4'];
  var Asteroid = Entity.subclass();

  Asteroid.prototype.init = function(x, y, velx, vely, size) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.velr = Math.random() * 0.08 - 0.04;
  
    this.u = 0;
    this.v = 0;
    this.velu = Math.random() * 0.25 - 0.5;
    this.velv = Math.random() * 0.25 - 0.5;

    var ti = parseInt(Math.random() * asteroidTextures.length);
    this.texture = textures[asteroidTextures[ti]];

    this.size = size || 4;

    // TODO: maybe make this a method?
    this.boundingRadius = this.size * 10;
    return this;
  };

  Asteroid.prototype.onStep = function() {
    this.u += this.velu;
    this.v += this.velv;
  };

  Asteroid.BONUS_SPAWN_CHANCE = 0.05;

  Asteroid.prototype.onDie = function() {
    this.game.addPoints(this.size * 5);

    if (this.size > 1) {
      this.spawnChild();
      this.spawnChild();
    }

    if (Math.random() < Asteroid.BONUS_SPAWN_CHANCE) {
      this.spawn(Bonus.create().init(this.x, this.y));
    }
  };

  Asteroid.prototype.onDraw = function(ctx) {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);

    ctx.translate(this.u, this.v);
    gfx.circle(ctx, -this.u, -this.v, this.boundingRadius);
    ctx.fillStyle = this.texture;
    ctx.fill();
  };

  Asteroid.prototype.spawnChild = function() {
    // TODO: make these circular, cuz right now they're square.
    var xoff = utils.random(-10, 10);
    var yoff = utils.random(-10, 10);
    this.spawn(Asteroid.create().init(
        this.x + xoff, this.y + yoff, utils.random(-1, 1), utils.random(-1, 1), this.size - 1)); 
  };
  
  Asteroid.prototype.onCollision = function(other) {
    other.onCollideWithAsteroid(this);
  };

  return Asteroid;
});
