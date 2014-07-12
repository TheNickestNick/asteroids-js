define(function() {
  function mixin(src, target) {
    for (var key in src) {
      if (key !== 'update' && key !== 'init') {
        target.prototype[key] = src[key];
      }
    }
  };

  var entities = {
    define: function() {
      var behaviors = arguments.slice(0, -1);
      var def = arguments[arguments.length - 1];

      // TODO: should behaviors be functions, instead of having an init method?
      var constructor = function() {
        for (var i = 0; i < behaviors.length; i++) {
          if (typeof behaviors[i].init === 'function') {
            behaviors[i].init.apply(this, arguments);
          }
        }

        def.ctor.apply(this, arguments);
      };
      
      for (var i = 0; i < behaviors.length; i++) {
        mixin(behavior[i], constructor);
      }

      constructor.prototype.update = function() {
        for (var i = 0; i < behaviors.length; i++) {
          behaviors[i].update.apply(this, arguments);
        }
      };

      // TODO: add instance management code


      return constructor;
    },
  };

  return entities;
});
