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
      videos: [{ filled: false, order: 0 }],
      name: '',
      others: []
    };
  }

  componentDidUpdate(): ?void {
    var videoIds = [];
    for (var i = 1; i < this.state.maxSlots; i++) {
      videoIds.push(`video${i}`);
    }

    if (Object.keys(easyrtc.getRoomsJoined()).length > 0) {
      var video = this.refs[`video${easyrtc.myEasyrtcid}`].getDOMNode();
      video.src = easyrtc.getLocalStreamAsUrl();
      video.autoplay = true;
      video.mute = true;
      video.volume = 0;
    }

    _.forEach(this.state.videos, (video) => {
      if (video.filled) {
        var vol = (video.easyrtcid === easyrtc.myEasyrtcid)? 0 : (1 - 0.33*parseInt(video.order - 1));
        this.refs[`video${video.easyrtcid}`].volume = vol;
      }
    });
  }

  componentDidMount(): ?void {
    var videoIds = [];
    var videos = this.state.videos;
    for (var i = 1; i < this.state.availableSlots; i++) {
      videoIds.push(`video${i}`);
      videos.push({ filled: false, order: i });
    }

    this.setState({ videos }, () => {
      easyrtc.dontAddCloseButtons();
      easyrtc.setRoomOccupantListener(this.callEverybodyElse.bind(this));
      easyrtc.easyApp("simu-office", "video0", videoIds, this.loginSuccess.bind(this));
      easyrtc.setPeerListener(this.messageListener.bind(this));
      easyrtc.setDisconnectListener(this.handleDisconnect.bind(this));
      easyrtc.setOnCall(this.newConnection.bind(this));
      easyrtc.setOnHangup(this.handleHangup.bind(this));
      easyrtc.setStreamAcceptor(this.handleStream.bind(this));
    });
  }

  newConnection(easyrtcid, slot): ?void {
    console.log(`connection count= ${easyrtc.getConnectionCount()}`);
  }

  handleStream(easyrtcid, stream): ?void {
    var videos = this.state.videos;
    var availableSlots = this.state.availableSlots;
    if (availableSlots > 0) {
      var index = this.state.maxSlots - availableSlots;
      videos[index] = { easyrtcid, filled: true, order: index, stream };
      this.setState({
        videos,
        availableSlots: availableSlots-1
      });
    }
  }

  messageListener(easyrtcid, msgType, content): ?void {
    console.log(easyrtcid, msgType, content);
  }

  establishConnection(list, position, connectCount): ?void {
    var maxSlots = this.state.maxSlots;
    function callSuccess() {
      connectCount++;
      if (connectCount < maxSlots && position > 0) {
        this.establishConnection.bind(this)(list, position-1, connectCount);
      }
    }
    function callFailure(errorCode, errorText) {
      easyrtc.showError(errorCode, errorText);
      if (connectCount < maxSlots && position > 0) {
        this.establishConnection.bind(this)(list, position-1, connectCount);
      }
    }
    easyrtc.call(list[position], callSuccess, callFailure);
  }

  callEverybodyElse(roomName, otherPeople, myInfo): ?void {
    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    var list = [];
    for (var easyrtcid in otherPeople) {
      list.push(easyrtcid);
    }

    if (list.length > 0) {
      this.setState({ name: roomName, others: list }, () => {
        this.establishConnection.bind(this)(list, list.length-1, 0);
      });
    } else {
      this.setState({ name: roomName, others: [] });
    }
  }

  handleHangup(easyrtcid, slot): ?void {
    console.log(easyrtcid);
    var availableSlots = this.state.availableSlots+1;
    var videos = this.state.videos;
    var foundVideo = _.findWhere(videos, { easyrtcid : easyrtcid });
    var index = _.indexOf(videos, foundVideo);
    videos[index] = { filled: true, order: index };
    this.setState({
      videos,
      availableSlots
    });
  }

  handleDisconnect(): ?void {
    easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
  }

  loginSuccess(easyrtcid): ?void {
    var videos = this.state.videos;
    videos[0] = { easyrtcid, filled: true, order: 0 };
    var availableSlots = (this.state.maxSlots-1);
    this.setState({
      videos,
      availableSlots
    });
  }

  render(): ?ReactElement {
    var videos = this.state.videos.sort(sortBy('order')).map((videoData, i) => {
      var className = videoData.filled? "CameraPreview" : "CameraPreview Hidden";
      var optionalProps = {};
      if (videoData.stream) {
        var vendorURL = window.URL || window.webkitURL;
        optionalProps.src =  vendorURL.createObjectURL(videoData.stream);
        optionalProps.autoPlay = true;
      }
      return <video ref={`video${videoData.easyrtcid}`} id={`video${i}`} {...optionalProps}
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
