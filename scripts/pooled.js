define(function() {
  return {
    makePooled: function(ctor, maxInstances) {
      ctor.MAX_INSTANCE_COUNT = maxInstances || Infinity;

      ctor.freeList_ = [];
      ctor.instanceCount_ = 0;

      ctor.create = function(arg) {
        if (ctor.instanceCount_ >= ctor.MAX_INSTANCE_COUNT) {
          throw new Error('Tried to create too many instances.'); 
        }

        if (ctor.freeList_.length > 0) {
          var instance = ctor.freeList_.pop();
          // TODO: consider whether we should have a "teardown" instead of a 
          // constructor. The teardown would be called each time an entity is
          // released. This might help find/prevent bugs due to references to
          // freed objects.
          ctor.call(instance, arg);
        }
        else {
          var instance = new ctor(arg);
        }

        ctor.instanceCount_++;
        return instance;
      };

      ctor.prototype.free = function() {
        ctor.freeList_.push(this);
        ctor.instanceCount--;
      };

      return ctor;
    }
  };
});
