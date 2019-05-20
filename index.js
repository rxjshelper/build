var rxe = (function() {
  var observable = new Rx.Subject();
  var observer = observable.publish();
  observer.connect();
  var ons = {};
  var sends = {};
  var event = function() {
    return event;
  };
  var reservedHandlerNames = ["error", "noHandler", "someHandler"];

  event.for = function(nme, except) {
    var ex = except;
    return {
      send: function(name, obj) {
        sends[name] = sends[name] || 0;
        ons[name] = ons[name] || 0;
        sends[name]++;
        observer.next({
          except: ex,
          for: nme,
          sendCont: sends[name],
          handlerCount: ons[name],
          name: name,
          data: obj
        });
      },
      on: function(name, f, strategy) {
        ons[name] = ons[name] || 0;
        ons[name]++;
        var handler = function(val) {
          if (val) {
            var isOwner = name === val.name;
            var noHandlerExist = val.sendCont[name] === 0;
            var strategyAllows =
              !strategy || (strategy === "NO_HANDLER_EXISTS" && noHandlerExist);
            var isIntendedRecipient = !val.for || (val.for && val.for === nme);
            if (
              (isIntendedRecipient && !val.except) ||
              (!isIntendedRecipient && val.except)
            ) {
              if (isOwner && strategyAllows) {
                try {
                  f(val.data, val, strategy);
                } catch (error) {
                  name !== "error" &&
                    event.send("error", {
                      message:
                        "An error happened while handling with strategy : '" +
                        strategy +
                        "' event '" +
                        name +
                        "' for '" +
                        nme +
                        "' except : " +
                        val.except,
                      error: error,
                      data: val
                    });
                  if (name !== "error") {
                  }
                }
              }
            }
          }
        };
        observer.subscribe(handler);
      }
    };
  };
  event.send = function(name, obj) {
    event.for().send(name, obj);
  };
  event.on = function(name, f, strategy) {
    event.for().on(name, f, strategy);
  };

  event.notFor = function(nme) {
    if (!nme) {
      throw "Please supply what the event is not for";
    }
    return event.for(nme, true);
  };
  $.fn.rxeOuterHTML = function(arg) {
    var ret;

    // If no items in the collection, return
    if (!this.length) return typeof arg == "undefined" ? this : null;
    // Getter overload (no argument passed)
    if (!arg) {
      return (
        this[0].outerHTML ||
        ((ret = this.wrap("<div>")
          .parent()
          .html()),
        this.unwrap(),
        ret)
      );
    }
    // Setter overload
    $.each(this, function(i, el) {
      var fnRet,
        pass = el,
        inOrOut = el.outerHTML ? "outerHTML" : "innerHTML";

      if (!el.outerHTML)
        el = $(el)
          .wrap("<div>")
          .parent()[0];

      if (jQuery.isFunction(arg)) {
        if ((fnRet = arg.call(pass, i, el[inOrOut])) !== false)
          el[inOrOut] = fnRet;
      } else el[inOrOut] = arg;

      if (!el.outerHTML)
        $(el)
          .children()
          .unwrap();
    });

    return this;
  };
  var dom = function(name, el) {
    if (dom[name]) {
      throw "Dom mapping already contains name " + name;
    }
    dom[name] = {
      element: el,
      shadow: "",
      handle: function(f) {
        var set = {};
        if (this.exists()) {
          var result = f($(this.element), set);
          return result;
        } else {
          var result = f($(this.shadow), set);
          this.shadow = set.update.rxeOuterHTML();
          return result;
        }
      },
      existsInShadow: function() {
        return $(this.element).size() > 0;
      },
      exists: function() {
        return $(this.element).size() > 0;
      },
      createRaw: function(html) {
        var isId = true;
        if (this.element.indexOf(".") == 0) {
          isId = false;
        } else if (this.element.indexOf("#") == 0) {
          isId = true;
        } else {
          throw "Element must be a class or an id";
        }

        if (this.exists() && isId) {
          throw "Element already exists in dom";
          //$(this.element).html(html);
        }
        if ((this.exists() && !isId) || !this.exists()) {
          var name = this.element.substring(1, this.element.length);
          this.shadow = html;
          if (!isId) {
            this.shadow = $(this.shadow)
              .addClass(name)
              .rxeOuterHTML();
          } else {
            this.shadow = $(this.shadow)
              .attr("id", name)
              .rxeOuterHTML();
          }
        }
      },
      create: function(el, html) {
        if (el && html) this.createRaw("<" + el + ">" + html + "</" + el + ">");
        else throw "Unable to create element with " + el + " and " + html;
      },
      insertReplace: function(el) {
        $(el).html(this.getOuterHtml());
      },
      insertAppend: function(el) {
        $(el).append(this.getOuterHtml());
      },
      insertPrepend: function(el) {
        var result = this.getOuterHtml();
        $(el).prepend(result);
      },
      insertAfter: function(el) {
        $(el).insertAfter(this.getOuterHtml());
      },
      insertBefore: function(el) {
        $(el).insertBefore(this.getOuterHtml());
      },
      replaceWith: function(el) {
        $(el).replaceWith(this.getOuterHtml());
      },
      enable: function() {
        return this.handle(function(elm, set) {
          elm.prop("disabled", false);
          set.update = elm;
          return result;
        });
      },
      disable: function() {
        return this.handle(function(elm, set) {
          elm.prop("disabled", true);
          set.update = elm;
        });
      },
      setHtml: function(h) {
        return this.handle(function(elm, set) {
          elm.html(h);
          set.update = elm;
        });
      },
      getHtml: function(h) {
        return this.handle(function(elm, set) {
          var result = elm.html();
          set.update = elm;
          return result;
        });
      },
      getOuterHtml: function(h) {
        return this.handle(function(elm, set) {
          var result = elm.rxeOuterHTML();
          set.update = elm;
          return result;
        });
      }
    };
  };

  return {
    event: event,
    dom: dom
  };
})();
