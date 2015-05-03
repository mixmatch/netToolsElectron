'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
var bodyParser = require('body-parser')
var compression = require('compression');
var express = require('express');
var cp = require('child_process');
var spawn = cp.spawn;
var exec = cp.exec;
var os = require('os');
var request = require('request');
var cheerio = require('cheerio');
//
var oneSecond = 1000;
var oneMinute = 60 * oneSecond;
var oneHour = 60 * oneMinute;
var oneDay = 24 * oneHour;
//
var currPlatform = os.platform();
var commands = {ping:{}, tracert:{}};
if (currPlatform === 'linux') {
    //linux
    commands.ping = {
      bin: '/bin/ping',
      count: '-c',
      size: '-s',
      timeout: '-W'
    };
    commands.tracert = {
      bin: '/usr/bin/tracepath'
    };
  } else if (currPlatform.match(/^win/)) {
    //windows
    commands.ping = {
      bin: 'C:/windows/system32/ping.exe',
      count: '-n',
      size: '-l',
      timeout: '-w'
    };
    commands.tracert = {
      bin: 'C:/windows/system32/tracert.exe',
    };
  } else if (currPlatform === 'darwin') {
    //mac osx
    commands.ping = {
      bin: '/bin/ping',
      count: '-c',
      size: '-s',
      timeout: '-t'
    };
    commands.tracert = {
      bin: '/bin/traceroute'
    };
  }
//
var defaults = {
  pingCoung: '100',
  pingSize: '64',
  // pingSize: '1472',
  pingTimeout: '2000'
}
var requests = {};
//
var expressApp = express();
// expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());
expressApp.use(compression());
expressApp.use(express.static(__dirname + '/public', { maxAge: oneSecond }));
expressApp.use(express.static(__dirname + '/bower_components', { maxAge: oneSecond }));
expressApp.post('/', function (req, res) {
  var requestID = Date.now();
  requests[requestID] = {id: requestID, result: {}};
  var currentRequest = requests[requestID];
  res.setHeader('Content-Type', 'application/json');
  var ip = req.body.ip;
  if (ip){
    //Build request object
    if (req.body.ping) {
      currentRequest.result.ping = {
        output: "",
        error: false,
        closeCode: false,
        complete: false
      }
    }
    if (req.body.tracert){
      currentRequest.result.tracert = {
        output: "",
        error: false,
        closeCode: false,
        complete: false
      }
      // res.write('\n\nTracert:\n');
      // var tracert = spawn('C:/windows/system32/tracert.exe', ['-4', ip]);
      // tracert.stdout.pipe(res);
    }
    if (req.body.portscan){
      // res.write('\n\nPort Scan:\n');
        currentRequest.result.portscan = {
          output: "",
          error: false,
          closeCode: false,
          complete: false
        }
    }
    //send initial response
    res.end(JSON.stringify(currentRequest, null, 2));
    //init processes
    if (req.body.ping) {
      // res.write('Ping:\n');
      var ping = spawn(commands.ping.bin, [commands.ping.count, defaults.pingCoung, commands.ping.size, defaults.pingSize, commands.ping.timeout, defaults.pingTimeout, ip]);
      ping.stdout.on('data', function(data) {
        // console.log('stdout: ' + data);
        currentRequest.result.ping.output += data.toString();
      });
      ping.stderr.on('data', function(data) {
        // console.log('stdout: ' + data);
        currentRequest.result.ping.error += data.toString();
      });
      ping.on('close', function (code) {
        // console.log('closing code: ' + code);
        currentRequest.result.ping.closeCode = code.toString();
        currentRequest.result.ping.complete = true;
      });
    }
    if (req.body.tracert) {
      // res.write('Ping:\n');
      var tracert = spawn(commands.tracert.bin, [ip]);
      tracert.stdout.on('data', function(data) {
        // console.log('stdout: ' + data);
        currentRequest.result.tracert.output += data.toString();
      });
      tracert.stderr.on('data', function(data) {
        // console.log('stdout: ' + data);
        currentRequest.result.tracert.error += data.toString();
      });
      tracert.on('close', function (code) {
        // console.log('closing code: ' + code);
        currentRequest.result.tracert.closeCode = code.toString();
        currentRequest.result.tracert.complete = true;
      });
    }
  } else {
    res.end(JSON.stringify({id: false}, null, 2));
  }
});
expressApp.get('/request', function (req, res) {
  var currentRequest = requests[req.query.requestID];
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(currentRequest, null, 2));
})
var server = expressApp.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  // console.log('Express app listening at http://%s:%s', host, port);
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
		resizable: true
	});

	// mainWindow.loadUrl(`file://${__dirname}/index.html`);
	mainWindow.loadUrl('http://localhost:3000/');

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		mainWindow = null;
	})
});
