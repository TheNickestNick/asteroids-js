define(function() {
  return {
    remove: function(arr, i) {
      if (i < 0 || i >= arr.length) {
        throw new Error('Tried to remove index that was out of bounds.');
      }
      arr[i] = arr[arr.length-1];
      arr.length--;
    }
  };
});
