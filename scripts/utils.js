define(function() {
  return {
    mixin: function(src, target) {
      if (typeof src !== 'function' || typeof target !== 'function') {
        return;
      }

      for (var key in src.prototype) {
        target.prototype[key] = src.prototype[key];
      }
    }
  };
});
