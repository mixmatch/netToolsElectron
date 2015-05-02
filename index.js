'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
var bodyParser = require('body-parser')
var compression = require('compression');
var express = require('express');
var cp = require('child_process');
var spawn = cp.spawn;
var exec = cp.exec;
var request = require('request');
var cheerio = require('cheerio');
//
var oneSecond = 1000;
var oneMinute = 60 * oneSecond;
var oneHour = 60 * oneMinute;
var oneDay = 24 * oneHour;
//
var pingCoung = '100';
var pingSize = '1472';
//
var expressApp = express();
// expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());
expressApp.use(compression());
expressApp.use(express.static(__dirname + '/public', { maxAge: oneSecond }));
expressApp.use(express.static(__dirname + '/bower_components', { maxAge: oneSecond }));
expressApp.post('/', function (req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  var ip = req.body.ip;
  if (ip){
    if (req.body.ping) {
      var pingOutput = "";
      res.write('Ping:\n');
      var ping = spawn('C:/windows/system32/ping.exe', ['-n', pingCoung, '-l', pingSize, '-w', '2000', ip]);
      ping.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
        // res.write(data.toString());
        pingOutput += data.toString();
        // res.write(String(data) + '<br />\n');
      });
      ping.stderr.on('data', function(data) {
        console.log('stdout: ' + data);
        res.write(data.toString());
      });
      ping.on('close', function (code) {
        console.log('closing code: ' + code);
        res.write(pingOutput);
        res.write('closing code: ' + code.toString() + '\n\n');
        res.end(JSON.stringify(req.body, null, 2));
      });
    }
    if (req.body.tracert){
      res.write('\n\nTracert:\n');
      // var tracert = spawn('C:/windows/system32/tracert.exe', ['-4', ip]);
      // tracert.stdout.pipe(res);
    }
    if (req.body.portscan){
      res.write('\n\nPort Scan:\n');
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
