/** @flow */
/* global navigator, io */
'use strict';

require('./styles.css');

import React from 'react';
import {Resolver} from 'react-resolver';

var socketio;

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      startButtonDisabled: true,
      stopButtonDisabled: true,
      justAudio: false,
      recordVideoSeparately: false,
      mediaStream: null,
      videoStream: null,
      audioStream: null
    };

    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
   }

  componentDidMount(): ?any {
    socketio = io();

    socketio.on('connect', () => {
      this.setState({ startButtonDisabled: false });
    });

    socketio.on('merged', (fileName) => {
      var href = (location.href.split('/').pop().length ? location.href.replace(location.href.split('/').pop(), '') : location.href);
      href = href + '/uploads/' + fileName;
      console.log('got file ' + href);
      var cameraPreview = this.refs.cameraPreview.getDOMNode();
      cameraPreview.src = href
      cameraPreview.play();
      cameraPreview.muted = false;
      cameraPreview.controls = true;
    });

    socketio.on('ffmpeg-output', (result) => {
      var progressBar = this.refs.progressBar.getDOMNode();
      var percentage = this.refs.percentage.getDOMNode();
      if (parseInt(result) >= 100) {
        progressBar.parentNode.style.display = 'none';
        return;
      }
      progressBar.parentNode.style.display = 'block';
      progressBar.value = result;
      percentage.innerHTML = 'Ffmpeg Progress ' + result + "%";
    });

    socketio.on('ffmpeg-error', (error) => {
      alert(error);
    });

    var self = this;
    var state = {};
    state.recordVideoSeparately = !!navigator.webkitGetUserMedia;

    if (!!navigator.webkitGetUserMedia && !state.recordVideoSeparately) {
      state.justAudio = true;
    }

    this.setState(state);
  }

  handleStart(): ?void {
    var self = this;
    this.setState({ startButtonDisabled: true}, () => {
      navigator.getUserMedia({
        audio: true,
        video: true
      }, function(stream) {
        var state  = {};
        state.mediaStream = stream;
        state.audioStream = RecordRTC(stream, {
          onAudioProcessStarted: function() {
            if (self.state.recordVideoSeparately) {
              self.state.videoStream.startRecording();
            }

            var cameraPreview = self.refs.cameraPreview.getDOMNode();
            cameraPreview.src = window.URL.createObjectURL(stream);
            cameraPreview.play();
            cameraPreview.muted = true;
            cameraPreview.controls = false;
          }
        });
        state.videoStream = RecordRTC(stream, {
          type: 'video'
        });
        state.audioStream.startRecording();
        state.stopButtonDisabled = false;
        self.setState(state);
       }, function(error) {
          alert( JSON.stringify(error) );
       });
    });
  }

  handleStop(): ?void {
    var state = {
      stopButtonDisabled: true,
      startButtonDisabled: false
    };

    this.setState(state, () => {
      var audioStream = this.state.audioStream;
      var videoStream = this.state.videoStream;
      var mediaStream = this.state.mediaStream;
      var cameraPreview = this.refs.cameraPreview.getDOMNode();

      // stop audio recorder
      if (this.state.recordVideoSeparately){
        audioStream.stopRecording(() => {
          // stop video recorder
          videoStream.stopRecording(() => {
            // get audio data-URL
            audioStream.getDataURL((audioDataURL) => {
              // get video data-URL
              videoStream.getDataURL((videoDataURL) => {
                var files = {
                  audio: {
                    type: audioStream.getBlob().type || 'audio/wav',
                    dataURL: audioDataURL
                  },
                  video: {
                    type: videoStream.getBlob().type || 'video/webm',
                    dataURL: videoDataURL
                  }
                };
                socketio.emit('message', files);
                if (mediaStream) {
                  mediaStream.stop();
                  this.setState({ mediaStream: mediaStream });
                }
              });
            });
            cameraPreview.src = '';
            cameraPreview.poster = 'ajax-loader.gif';
          });
        });
      }
      // if firefox or if you want to record only audio
      // stop audio recorder
      if (!this.state.recordVideoSeparately) {
        this.state.audioStream.stopRecording(() => {
          // get audio data-URL
          this.state.audioStream.getDataURL((audioDataURL) => {
            var files = {
              audio: {
                type: audioStream.getBlob().type || 'audio/wav',
                dataURL: audioDataURL
              }
            };
            socketio.emit('message', files);
            if (mediaStream) {
              mediaStream.stop();
              this.setState({ mediaStream: mediaStream });
            }
          });
          cameraPreview.src = '';
          cameraPreview.poster = 'ajax-loader.gif';
        });
      }
    });
  }

  render(): ?ReactElement {
    var media = <video ref="cameraPreview" className="CameraPreview" ></video>;
    if (this.state.justAudio) {
      media = <audio ref="cameraPreview" controls className="CameraPreview"></audio>;
    }

    return (
      <div className="Home">
        <div>
          {media}
        </div>

        <div>
          <label ref="percentage">Ffmpeg Progress 0%</label>
          <progress ref="progressBar" value="0" max="100"></progress>
          <br />
        </div>

        <div>
          <button disabled={this.state.startButtonDisabled} onClick={this.handleStart}>
            Start Recording
          </button>
          <button disabled={this.state.stopButtonDisabled} onClick={this.handleStop}>
            Stop Recording
          </button>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  // promise: React.PropTypes.string.isRequired,
};

Home.displayName = 'Home';

export default Resolver.createContainer(Home, {
  resolve: {
    /*
    promise() {
      return PromiseStore.find(this.getParams().id);
    }
    */
  },
});
