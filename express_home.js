var express = require("express");
var Lightning = require("./lightning");
var app = express();

app.get("/decode", async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  var invoice = req.query.invoice;
  console.log(invoice);
  res.json(await Lightning.decodeInvoice(invoice));
  //console.log(req.query.id);
  //console.log(res);
  //res.send("id: " + req.query.asd);
});

app.post('/pay', async function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(req.param.invoice)
});
app.listen(3000);