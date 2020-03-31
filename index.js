'use strict';

const express = require('express');
const request = require("request");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


function getNow() {
  return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
// App
const app = express();
app.get('/', (req, res) => {
  var url = "https://xgis.maaamet.ee/adsavalik/valjav6te/";
  console.log(getNow() + ' - Sending request to ' + url);
  request(url, function (error, response, body) {
    if (error) {
      return console.error(getNow() + ' - Failed, error: ' + error);
    }
    if (response) console.log(getNow() + ' - Got response from ' + url + ', response: ' + response.statusCode);
    if (body) {
      let item = JSON.parse(body).filter(function(i){return i.vvnr == 1 && !("kov" in i);});
      url = url + item[0].fail;
      res.set({
        'Content-Type': 'application/zip'
      });
      console.log(getNow() + ' - Sending request to ' + url);
      request(url, function (err, resp, body2)  {
        if (err) return console.error(getNow() + ' - Failed, error: ' + err);
        if (resp) console.log(getNow() + ' - Got response from ' + url + ', response: ' + resp.statusCode);
      }).pipe(res);
    }
  });
});

app.get('/status', (req, res) => {
  res.statusCode = 200;
  res.end('Server running, current time: ' + getNow());
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);