define(function() {
  var Keys = { SPACE: 32, RIGHT: 37, UP: 38, LEFT: 39, DOWN: 40 };

  var input = {};
  input.init = function(game) {
    this.game = game;
    this.pressed = {};

    document.body.addEventListener('keydown', input.keyDown.bind(this));
    document.body.addEventListener('keyup', input.keyUp.bind(this));
  };

  input.keyDown = function(event) {
    if (!this.pressed[event.which]) {
      this.keyPress(event);
      this.pressed[event.which] = true;
    }
  };

  //TODO: these should not be interacting with game.ship directly!
  input.keyPress = function(event) {
    if (event.which == Keys.SPACE) {
      this.game.ship.shoot(true);
    }
    else if (event.which == Keys.RIGHT) {
      this.game.ship.turn(-1);
    }
    else if (event.which == Keys.LEFT) {
      this.game.ship.turn(1);
    }
    else if (event.which == Keys.UP) {
      this.game.ship.thrust(true);
    }
  }

  input.keyUp = function(event) {
    this.pressed[event.which] = false;

    if (event.which == Keys.SPACE) {
      this.game.ship.shoot(false);
    }
    else if (event.which == Keys.RIGHT) {
      this.game.ship.turn(0);
    }
    else if (event.which == Keys.LEFT) {
      this.game.ship.turn(0);
    }
    else if (event.which == Keys.UP) {
      this.game.ship.thrust(false);
    }
  };

  return input;
});
