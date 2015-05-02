/** @flow */
require('es6-promise').polyfill();
require('isomorphic-fetch');
var fs = require('fs');
var debug = require('debug')('app startup');

import express from 'express';
import React from 'react';
import Router from 'react-router';
import {Resolver} from 'react-resolver';
import routes from '../routes';
import {resources} from './webpack';

import {readFileSync as read} from 'fs';
import {join} from 'path';

var tmpl = o => read('./index.html', 'utf8')
  .replace('†react†', o.html)
  .replace('†__resolver__†', JSON.stringify(o.data))
  .replace('†head†', resources());

var app = express();
var server = require('http').Server(app);

app.use('/cdn', express.static(join(process.cwd(), 'dist')));

app.use('/public', express.static(join(process.cwd(), 'public')));

app.get('*', function(req, res) {
  var router = Router.create({
    routes: routes,
    location: req.url,
    onAbort(redirect) {
      res.writeHead(303, {Location: redirect.to});
      res.end();
    },
    onError(err) {
      debug('Routing Error');
      debug(err);
    },
  });

  router.run((Handler, state) => (
    Resolver.renderToString(<Handler />)
      .then(o => res.send(tmpl({html: o.toString(), data: o.data})))
  ));
});

debug('app server starting on 4000');
var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;

  debug('React-docs listening at http://%s:%s', host, port);
});


// New method
var easyrtc = require('easyrtc');  // EasyRTC external module
var io = require('socket.io');

var socketServer = io.listen(server, { 'log level':1 });

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer);


// Socket.IO part
// var io = require('socket.io')(server);
//
// io.on('connection', function (socket) {
//   console.log('New client connected!');
//
//   socket.on('message', function(data) {
//     console.log('writing to disk');
//     writeToDisk(data.audio.dataURL, data.audio.name);
//     writeToDisk(data.video.dataURL, data.video.name);
//
//     merge(socket, data.audio.name, data.video.name);
//   });
// });
//
// function writeToDisk(dataURL, fileName) {
//   var fileExtension = fileName.split('.').pop(),
//       fileRootNameWithBase = './uploads/' + fileName,
//       filePath = fileRootNameWithBase,
//       fileID = 2,
//       fileBuffer;
//
//   // @todo return the new filename to client
//   while (fs.existsSync(filePath)) {
//     filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
//     fileID += 1;
//   }
//
//   dataURL = dataURL.split(',').pop();
//   fileBuffer = new Buffer(dataURL, 'base64');
//   fs.writeFileSync(filePath, fileBuffer);
//
//   console.log('filePath', filePath);
// }
//
// function merge(socket, fileName) {
//   var FFmpeg = require('fluent-ffmpeg');
//
//   var audioFile = path.join(__dirname, 'uploads', fileName + '.wav'),
//       videoFile = path.join(__dirname, 'uploads', fileName + '.webm'),
//       mergedFile = path.join(__dirname, 'uploads', fileName + '-merged.webm');
//
//   new FFmpeg({
//         source: videoFile
//       })
//       .addInput(audioFile)
//       .on('error', function (err) {
//         socket.emit('ffmpeg-error', 'ffmpeg : An error occurred: ' + err.message);
//       })
//       .on('progress', function (progress) {
//         socket.emit('ffmpeg-output', Math.round(progress.percent));
//       })
//       .on('end', function () {
//         socket.emit('merged', fileName + '-merged.webm');
//         console.log('Merging finished !');
//
//         // removing audio/video files
//         fs.unlink(audioFile);
//         fs.unlink(videoFile);
//       })
//       .saveToFile(mergedFile);
// }
