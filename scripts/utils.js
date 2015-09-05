define(function() {
  return {
    random: function(min, max) {
      var range = max - min;
      return min + Math.random() * range;
    },

    randomSign: function() {
      return Math.random() >= 0.5 ? 1 : -1;
    }
  };
});
