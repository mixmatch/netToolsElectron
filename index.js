'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
var bodyParser = require('body-parser')
var compression = require('compression');
var express = require('express');
var spawn = require('child_process').spawn;
var request = require('request');
var cheerio = require('cheerio');
//
var oneMinute = 60000;
var oneHour = 360000;
var oneDay = 86400000;
//
var expressApp = express();
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(compression());
expressApp.use(express.static(__dirname + '/public', { maxAge: oneHour }));
expressApp.post('/', function (req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.write('you posted:\n');
  var ip = req.body.ip;
  if (ip){
    res.write('IP: ' + ip + '\n');
    if (req.body.ping){
      var ping = spawn('C:/windows/system32/ping.exe', [ip]);
      ping.stdout.pipe(res);
      // var child = cp.spawn('C:/windows/system32/ping.exe', ['-n', '1', '-w', '5000', ip]);
      // child.on('error', function (e) {
      //   var err = new Error('ping.probe: there was an error while executing the ping program. check the path or permissions...');
      //   //cb(null, err);
      // });
      // child.stdout.on('data', function(data) {
      //   console.log('stdout: ' + data);
      //   res.write(String(data) + '<br />\n');
      // });
      // child.stderr.on('data', function(data) {
      //   console.log('stdout: ' + data);
      //   res.write(String(data) + '<br />\n');
      // });
      // child.on('close', function(code) {
      //   console.log('closing code: ' + code);
      //   // res.write(String(data) + '<br />\n');
      // });
    }
    if (req.body.portscan){
      res.write('Port Scan: ' + req.body.portscan + '\n');
    }
  }
  // res.end(JSON.stringify(req.body, null, 2));
  
});
var server = expressApp.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being GC'd
let mainWindow = null;

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', function () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: false
	});

	// mainWindow.loadUrl(`file://${__dirname}/index.html`);
	mainWindow.loadUrl('http://localhost:3000/');

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		mainWindow = null;
	})
});
