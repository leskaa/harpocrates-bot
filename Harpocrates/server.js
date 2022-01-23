var express = require('express');
var app = express();
var listener = app.listen(process.env.PORT, function() {
  console.log('Listening on port ' + listener.address().port + ".");
});
app.get('/', function(request, response) {
  response.send("Harpocrates is online.");
});