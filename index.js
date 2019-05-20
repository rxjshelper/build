var rxe = (function() {
  var observable = new Rx.Subject();
  var observer = observable.publish();
  observer.connect();
  return {
    send: function(name, obj) {
      observer.next({
        name: name,
        data: obj
      });
    },
    on: function(name, f) {
      var handler = function(val) {
        if (val) {
          if (name === val.name) {
            f(val.data);
          }
        }
      };
      observer.subscribe(handler);
    }
  };
})();
