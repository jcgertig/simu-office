/** @flow */
/* global navigator, io, easyrtc */
'use strict';

require('./styles.css');

import React from 'react';
import {Resolver} from 'react-resolver';
import _ from 'lodash';
import sortBy from 'sort-by';

var socketio;

class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      maxSlots: 4,
      availableSlots: 4,
      videos: [{ easyrtcid: '', filled: false, order: 0 }],
      name: ''
    };
  }

  newConnection(easyrtcid, slot): ?void {
    console.log(`connection count= ${easyrtc.getConnectionCount()}`);
    var videos = this.state.videos;
    var availableSlots = this.state.availableSlots;
    if (availableSlots > 0) {
      var index = (this.state.maxSlots-1) - availableSlots;
      videos[index] = { easyrtcid, filled: true, order: index };
      this.setState({
        videos,
        availableSlots: availableSlots+1
      });
    }
  }

  messageListener(easyrtcid, msgType, content): ?void {
    console.log(easyrtcid, msgType, content);
  }

  callEverybodyElse(roomName, otherPeople): ?void {
    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    var list = [];
    var connectCount = 0;
    for (var easyrtcid in otherPeople) {
      list.push(easyrtcid);
    }

    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    function establishConnection(position) {
      function callSuccess() {
        connectCount++;
        if(connectCount < maxCALLERS && position > 0) {
          establishConnection(position-1);
        }
      }
      function callFailure(errorCode, errorText) {
        easyrtc.showError(errorCode, errorText);
        if(connectCount < maxCALLERS && position > 0) {
          establishConnection(position-1);
        }
      }
      easyrtc.call(list[position], callSuccess, callFailure);
    }

    if (list.length > 0) {
      this.setState({ name: roomName }, () => {
        establishConnection(list.length-1);
      });
    } else {
      this.setState({ name: roomName });
    }
  }

  handleHangup(easyrtcid, slot): ?void {
    var availableSlots = this.state.availableSlots;
    var videos = _.this.state.videos;
    var foundVideo = _.findWhere(videos, { easyrtcid });
    videos = _.filter(videos, (video) => _.isEqual(video, foundVideo));
    this.setState({
      videos,
      availableSlots: availableSlots+1
    });
  }

  handleDisconnect(): ?void {
    easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
  }

  loginSuccess(easyrtcid): ?void {
    var videos = this.state.videos;
    videos[0] = { easyrtcid, filled: true };
    this.setState({ videos });
  }

  componentDidUpdate(): ?any {
    var videoIds = [];
    for (var i = 1; i < this.state.availableSlots; i++) {
      videoIds.push(`video${i}`);
    }
    easyrtc.easyApp("simu-office", "video0", videoIds, this.loginSuccess.bind(this));
    _.forEach(this.state.videos, (video) => {
      if (video.filled) {
        var vol = (video.easyrtcid === easyrtc.myEasyrtcid())? 0 : (1 - 0.33*parseInt(video.order - 1));
        this.refs[`video${video.easyrtcid}`].volume = vol;
      }
    });
  }

  componentDidMount(): ?any {
    var videoIds = [];
    var videos = this.state.videos;
    for (var i = 1; i < this.state.availableSlots; i++) {
      videoIds.push(`video${i}`);
      videos.push({ filled: false, order: i });
    }

    this.setState({ videos }, () => {
      easyrtc.setRoomOccupantListener(this.callEverybodyElse.bind(this));
      easyrtc.easyApp("simu-office", "video0", videoIds, this.loginSuccess.bind(this));
      easyrtc.setPeerListener(this.messageListener.bind(this));
      easyrtc.setDisconnectListener(this.handleDisconnect.bind(this));
      easyrtc.setOnCall(this.newConnection.bind(this));
      easyrtc.setOnHangup(this.handleHangup.bind(this));
    });
  }

  render(): ?ReactElement {
    var videos = this.state.videos.sort(sortBy('order')).map((videoData, i) => {
      var className = videoData.filled? "CameraPreview" : "CameraPreview Hidden";
      return <video ref={`video${videoData.easyrtcid}`} id={`video${i}`}
                key={videoData.easyrtcid} className={className} ></video>;
    });

    return (
      <div className="Home">
        <h1>Room: {this.state.name}</h1>
        <div className="Videos">
          {videos}
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
