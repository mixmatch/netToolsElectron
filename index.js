'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
var express = require('express');
var expressApp = express();
var request = require('request');
var cheerio = require('cheerio');
expressApp.get('/', function (req, res) {
  res.send('Hello World!');
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
	mainWindow.loadUrl(`http://localhost:3000/`);

	mainWindow.on('closed', function () {
		// deref the window
		// for multiple windows store them in an array
		mainWindow = null;
	})
});
