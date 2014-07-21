define(['./entity', './gfx', './utils', './array'], function(Entity, gfx, utils, array) {
  var Bonus = Entity.subclass(function() {
    this.type = 0;
    this.boundingRadius = 13;
  });

  Bonus.MIN_TTL = 400;
  Bonus.MAX_TTL = 800;

  Bonus.TYPES = [{
      color: 'red',
      apply: function(ship) {
        ship.decreaseReload();
        console.log('Bonus: Decrease cannon reload time.');
      }
    }, {
      color: 'blue',
      apply: function(ship) {
        ship.decreaseRecoil();
        console.log('Bonus: Decrease cannon recoil.');
      },
    }, {
      color: 'red',
      apply: function(ship) {
        ship.addCannon();
        console.log('Bonus: Additional cannon.');
      }
    }, {
      color: 'green',
      apply: function(ship, game) {
        game.lives++;
        console.log('Bonus: Extra life!');
      }
    }, {
      color: 'green', 
      apply: function(ship) {
        console.log('Bonus: Temporarily invincible!');
        ship.makeInvincible(200);
      }
    }, {
      color: 'blue', 
      apply: function(ship) {
        console.log('Bonus: Inertial brakes.');
        ship.enableBrakes();
      }
    }];

  Bonus.prototype.init = function(x, y) {
    this.x = x;
    this.y = y;
    this.velx = utils.random(-3, 3); 
    this.vely = utils.random(-3, 3); 
    this.ttl = utils.random(Bonus.MIN_TTL, Bonus.MAX_TTL);
    this.type = array.random(Bonus.TYPES);
    return this;
  };

  Bonus.prototype.onDraw = function(ctx) {
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI/4);

    ctx.save();
    ctx.rotate(-this.aliveTime * 0.12);
    ctx.beginPath();
    ctx.rect(-6, -6, 12, 12);
    ctx.closePath();
    ctx.fillStyle = this.type.color;
    ctx.fill();
    ctx.restore();

    // TODO: add flicker when about to die
    ctx.save();
    ctx.rotate(this.aliveTime * 0.12);
    ctx.beginPath();
    ctx.rect(-12, -12, 24, 24);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.type.color;
    ctx.stroke();
    ctx.restore();
  };

  Bonus.prototype.onStep = function() {
    this.time++;
  };

  Bonus.prototype.applyTo = function(ship, game) {
    this.type.apply(ship, game);
  };

  return Bonus;
});
