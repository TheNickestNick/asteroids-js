define(function() {
  return {
    random: function(min, max) {
      var range = max - min;
      return min + Math.random() * range;
    }
  };
});
