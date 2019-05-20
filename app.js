rxe.dom("orderNumber", ".OrdNum");
rxe.event.on("name", function(data, meta, strategy) {
  rxe.dom.orderNumber.create("div", data.myEvent);
  rxe.dom.orderNumber.insertPrepend("body");
  rxe.dom.orderNumber.setHtml(data.myEvent);
});

rxe.event.for("you").on("name", function(data, meta, strategy) {
  rxe.dom("orderNumber1-" + data.myEvent, ".OrdNum-" + data.myEvent);
  rxe.dom["orderNumber1-" + data.myEvent].create(
    "div",
    "orderNumber1-" +
      data.myEvent +
      data.myEvent +
      "*****  Send count : " +
      meta.sendCont +
      " handler count : " +
      meta.handlerCount +
      " strategy : " +
      strategy
  );
  rxe.dom["orderNumber1-" + data.myEvent].insertPrepend("body");
});

rxe.event.for("sam").on("name", function(data, meta, strategy) {
  rxe.dom("orderNumber-" + data.myEvent, "#OrdNum-" + data.myEvent);
  rxe.dom["orderNumber-" + data.myEvent].create(
    "div",
    "orderNumber-" +
      data.myEvent +
      data.myEvent +
      " Send count : " +
      meta.sendCont +
      " handler count : " +
      meta.handlerCount +
      " strategy : " +
      strategy
  );
  rxe.dom["orderNumber-" + data.myEvent].insertPrepend("body");
});
rxe.event.on("name", function(data) {
  throw "I just threw this error...Awesome!!!";
});
rxe.event.on("error", function(data) {
  $("body").append('<div style="color:red">' + JSON.stringify(data) + "</div>");
});

rxe.event.send("name", {
  myEvent: "boo1"
});

rxe.event.send("name", {
  myEvent: "boo2"
});

rxe.event.send("name", {
  myEvent: "boo3"
});

rxe.event.for("sam").send("name", {
  myEvent: "12345"
});

rxe.event.for().send("name", {
  myEvent: "yyyyyy"
});

rxe.event.notFor("sam").send("name", {
  myEvent: "zzzzzzzz"
});
