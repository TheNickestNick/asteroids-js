define('./entities', './behaviors', function(entities, behaviors) {
  var Asteroid = entities.define(
      behaviors.movesWithVelocity, 
      behaviors.wrappable, {
    constructor: function() {
    }
  });;

  return Asteroid;
});
