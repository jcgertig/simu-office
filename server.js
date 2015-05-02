var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.client');
var port = config.__options.hotServerPort;
var debug = require('debug')('server');
var fs = require('fs');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
}).listen(port, 'localhost', function(err, result) {
  if (err) { return debug(err); }

  debug('Listening at localhost:' + port);
});

// Socket.IO part
var io = require('socket.io')('server');

var sendComments = function (socket) {
  fs.readFile('_comments.json', 'utf8', function(err, comments) {
    comments = JSON.parse(comments);
    socket.emit('comments', comments);
  });
};

io.on('connection', function (socket) {
  console.log('New client connected!');

  socket.on('message', function(data) {
    console.log('writing to disk');
    writeToDisk(data.audio.dataURL, data.audio.name);
    writeToDisk(data.video.dataURL, data.video.name);

    merge(socket, data.audio.name, data.video.name);
  });
});

function writeToDisk(dataURL, fileName) {
  var fileExtension = fileName.split('.').pop(),
      fileRootNameWithBase = './uploads/' + fileName,
      filePath = fileRootNameWithBase,
      fileID = 2,
      fileBuffer;

  // @todo return the new filename to client
  while (fs.existsSync(filePath)) {
    filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
    fileID += 1;
  }

  dataURL = dataURL.split(',').pop();
  fileBuffer = new Buffer(dataURL, 'base64');
  fs.writeFileSync(filePath, fileBuffer);

  console.log('filePath', filePath);
}

function merge(socket, fileName) {
  var FFmpeg = require('fluent-ffmpeg');

  var audioFile = path.join(__dirname, 'uploads', fileName + '.wav'),
      videoFile = path.join(__dirname, 'uploads', fileName + '.webm'),
      mergedFile = path.join(__dirname, 'uploads', fileName + '-merged.webm');

  new FFmpeg({
        source: videoFile
      })
      .addInput(audioFile)
      .on('error', function (err) {
        socket.emit('ffmpeg-error', 'ffmpeg : An error occurred: ' + err.message);
      })
      .on('progress', function (progress) {
        socket.emit('ffmpeg-output', Math.round(progress.percent));
      })
      .on('end', function () {
        socket.emit('merged', fileName + '-merged.webm');
        console.log('Merging finished !');

        // removing audio/video files
        fs.unlink(audioFile);
        fs.unlink(videoFile);
      })
      .saveToFile(mergedFile);
}
