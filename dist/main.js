require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(12)['default'];
	
	var _express = __webpack_require__(1);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _React = __webpack_require__(2);
	
	var _React2 = _interopRequireDefault(_React);
	
	var _Router = __webpack_require__(15);
	
	var _Router2 = _interopRequireDefault(_Router);
	
	var _Resolver = __webpack_require__(3);
	
	var _routes = __webpack_require__(13);
	
	var _routes2 = _interopRequireDefault(_routes);
	
	var _resources = __webpack_require__(14);
	
	var _read = __webpack_require__(4);
	
	var _join = __webpack_require__(5);
	
	/** @flow */
	__webpack_require__(6).polyfill();
	__webpack_require__(7);
	var fs = __webpack_require__(4);
	var debug = __webpack_require__(8)('app startup');
	
	var tmpl = function tmpl(o) {
	  return _read.readFileSync('./index.html', 'utf8').replace('†react†', o.html).replace('†__resolver__†', JSON.stringify(o.data)).replace('†head†', _resources.resources());
	};
	
	var app = _express2['default']();
	var server = __webpack_require__(9).Server(app);
	
	app.use('/cdn', _express2['default']['static'](_join.join(process.cwd(), 'dist')));
	
	app.use('/public', _express2['default']['static'](_join.join(process.cwd(), 'public')));
	
	app.get('*', function (req, res) {
	  var router = _Router2['default'].create({
	    routes: _routes2['default'],
	    location: req.url,
	    onAbort: function onAbort(redirect) {
	      res.writeHead(303, { Location: redirect.to });
	      res.end();
	    },
	    onError: function onError(err) {
	      debug('Routing Error');
	      debug(err);
	    } });
	
	  router.run(function (Handler, state) {
	    return _Resolver.Resolver.renderToString(_React2['default'].createElement(Handler, null)).then(function (o) {
	      return res.send(tmpl({ html: o.toString(), data: o.data }));
	    });
	  });
	});
	
	debug('app server starting on 4000');
	var server = app.listen(process.env.PORT || 4000, function () {
	  var host = server.address().address;
	  var port = server.address().port;
	
	  debug('React-docs listening at http://%s:%s', host, port);
	});
	
	// New method
	var easyrtc = __webpack_require__(10); // EasyRTC external module
	var io = __webpack_require__(11);
	
	var socketServer = io.listen(server, { 'log level': 1 });
	
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("react");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("react-resolver");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("fs");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("path");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("es6-promise");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("isomorphic-fetch");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("debug");

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("http");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("easyrtc");

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("socket.io");

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$defineProperty = __webpack_require__(16)['default'];
	
	var _interopRequireDefault = __webpack_require__(12)['default'];
	
	_Object$defineProperty(exports, '__esModule', {
	  value: true
	});
	
	/** @flow */
	
	var _React = __webpack_require__(2);
	
	var _React2 = _interopRequireDefault(_React);
	
	var _Router = __webpack_require__(15);
	
	var _Router2 = _interopRequireDefault(_Router);
	
	var _App = __webpack_require__(17);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _Home = __webpack_require__(18);
	
	var _Home2 = _interopRequireDefault(_Home);
	
	var _NotFound = __webpack_require__(19);
	
	var _NotFound2 = _interopRequireDefault(_NotFound);
	
	var DefaultRoute = _Router2['default'].DefaultRoute;
	var Route = _Router2['default'].Route;
	var NotFoundRoute = _Router2['default'].NotFoundRoute;
	
	var routes = _React2['default'].createElement(
	  Route,
	  { path: '/', handler: _App2['default'] },
	  _React2['default'].createElement(DefaultRoute, { name: 'home', handler: _Home2['default'] }),
	  _React2['default'].createElement(NotFoundRoute, { handler: _NotFound2['default'] })
	);
	
	exports['default'] = routes;
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Object$defineProperty = __webpack_require__(16)['default'];
	
	_Object$defineProperty(exports, '__esModule', {
	  value: true
	});
	
	// TODO(dlk): extract this info from webpack’s stats file
	function resources() {
	  if (true) {
	    return '<script async src="//localhost:4001/dist/client.js"></script>';
	  }
	
	  return '\n    <link rel="stylesheet" href="/cdn/styles.css" />\n    <script async src="/cdn/client.js"></script>\n  '.trim();
	}
	
	var resources = resources;
	exports.resources = resources;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.DefaultRoute = __webpack_require__(22);
	exports.Link = __webpack_require__(23);
	exports.NotFoundRoute = __webpack_require__(24);
	exports.Redirect = __webpack_require__(25);
	exports.Route = __webpack_require__(26);
	exports.RouteHandler = __webpack_require__(27);
	
	exports.HashLocation = __webpack_require__(28);
	exports.HistoryLocation = __webpack_require__(29);
	exports.RefreshLocation = __webpack_require__(30);
	exports.StaticLocation = __webpack_require__(31);
	exports.TestLocation = __webpack_require__(32);
	
	exports.ImitateBrowserBehavior = __webpack_require__(33);
	exports.ScrollToTopBehavior = __webpack_require__(34);
	
	exports.History = __webpack_require__(35);
	exports.Navigation = __webpack_require__(36);
	exports.State = __webpack_require__(37);
	
	exports.createRoute = __webpack_require__(38).createRoute;
	exports.createDefaultRoute = __webpack_require__(38).createDefaultRoute;
	exports.createNotFoundRoute = __webpack_require__(38).createNotFoundRoute;
	exports.createRedirect = __webpack_require__(38).createRedirect;
	exports.createRoutesFromReactChildren = __webpack_require__(39);
	exports.create = __webpack_require__(40);
	exports.run = __webpack_require__(41);

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(48), __esModule: true };

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(42)['default'];
	
	var _createClass = __webpack_require__(43)['default'];
	
	var _classCallCheck = __webpack_require__(44)['default'];
	
	var _Object$defineProperty = __webpack_require__(16)['default'];
	
	var _interopRequireDefault = __webpack_require__(12)['default'];
	
	_Object$defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _React = __webpack_require__(2);
	
	var _React2 = _interopRequireDefault(_React);
	
	var _RouteHandler = __webpack_require__(15);
	
	/** @flow */
	'use strict';
	
	__webpack_require__(49);
	
	var AppBase = (function (_React$Component) {
	  function AppBase() {
	    _classCallCheck(this, AppBase);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(AppBase, _React$Component);
	
	  _createClass(AppBase, [{
	    key: 'render',
	    value: function render() {
	      return _React2['default'].createElement(
	        'div',
	        null,
	        _React2['default'].createElement(_RouteHandler.RouteHandler, null)
	      );
	    }
	  }]);
	
	  return AppBase;
	})(_React2['default'].Component);
	
	exports['default'] = AppBase;
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = __webpack_require__(45)['default'];
	
	var _inherits = __webpack_require__(42)['default'];
	
	var _get = __webpack_require__(46)['default'];
	
	var _createClass = __webpack_require__(43)['default'];
	
	var _classCallCheck = __webpack_require__(44)['default'];
	
	var _Object$defineProperty = __webpack_require__(16)['default'];
	
	var _Object$keys = __webpack_require__(47)['default'];
	
	var _interopRequireDefault = __webpack_require__(12)['default'];
	
	_Object$defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _React = __webpack_require__(2);
	
	var _React2 = _interopRequireDefault(_React);
	
	var _Resolver = __webpack_require__(3);
	
	var _import = __webpack_require__(20);
	
	var _import2 = _interopRequireDefault(_import);
	
	var _sortBy = __webpack_require__(21);
	
	var _sortBy2 = _interopRequireDefault(_sortBy);
	
	/** @flow */
	/* global navigator, io, easyrtc */
	'use strict';
	
	__webpack_require__(49);
	
	var socketio;
	
	var Home = (function (_React$Component) {
	  function Home() {
	    _classCallCheck(this, Home);
	
	    _get(Object.getPrototypeOf(Home.prototype), 'constructor', this).call(this);
	    this.state = {
	      maxSlots: 4,
	      availableSlots: 4,
	      videos: [{ filled: false, order: 0 }],
	      name: '',
	      others: []
	    };
	  }
	
	  _inherits(Home, _React$Component);
	
	  _createClass(Home, [{
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      var _this = this;
	
	      var videoIds = [];
	      for (var i = 1; i < this.state.maxSlots; i++) {
	        videoIds.push('video' + i);
	      }
	
	      if (_Object$keys(easyrtc.getRoomsJoined()).length > 0) {
	        var video = this.refs['video' + easyrtc.myEasyrtcid].getDOMNode();
	        video.src = easyrtc.getLocalStreamAsUrl();
	        video.autoplay = true;
	        video.mute = true;
	        video.volume = 0;
	      }
	
	      _import2['default'].forEach(this.state.videos, function (video) {
	        if (video.filled) {
	          var vol = video.easyrtcid === easyrtc.myEasyrtcid ? 0 : 1 - 0.33 * parseInt(video.order - 1);
	          _this.refs['video' + video.easyrtcid].volume = vol;
	        }
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      var videoIds = [];
	      var videos = this.state.videos;
	      for (var i = 1; i < this.state.availableSlots; i++) {
	        videoIds.push('video' + i);
	        videos.push({ filled: false, order: i });
	      }
	
	      this.setState({ videos: videos }, function () {
	        easyrtc.dontAddCloseButtons();
	        easyrtc.setRoomOccupantListener(_this2.callEverybodyElse.bind(_this2));
	        easyrtc.easyApp('simu-office', 'video0', videoIds, _this2.loginSuccess.bind(_this2));
	        easyrtc.setPeerListener(_this2.messageListener.bind(_this2));
	        easyrtc.setDisconnectListener(_this2.handleDisconnect.bind(_this2));
	        easyrtc.setOnCall(_this2.newConnection.bind(_this2));
	        easyrtc.setOnHangup(_this2.handleHangup.bind(_this2));
	        easyrtc.setStreamAcceptor(_this2.handleStream.bind(_this2));
	      });
	    }
	  }, {
	    key: 'newConnection',
	    value: function newConnection(easyrtcid, slot) {
	      console.log('connection count= ' + easyrtc.getConnectionCount());
	    }
	  }, {
	    key: 'handleStream',
	    value: function handleStream(easyrtcid, stream) {
	      var videos = this.state.videos;
	      var availableSlots = this.state.availableSlots;
	      if (availableSlots > 0) {
	        var index = this.state.maxSlots - availableSlots;
	        videos[index] = { easyrtcid: easyrtcid, filled: true, order: index, stream: stream };
	        this.setState({
	          videos: videos,
	          availableSlots: availableSlots - 1
	        });
	      }
	    }
	  }, {
	    key: 'messageListener',
	    value: function messageListener(easyrtcid, msgType, content) {
	      console.log(easyrtcid, msgType, content);
	    }
	  }, {
	    key: 'establishConnection',
	    value: function establishConnection(list, position, connectCount) {
	      var maxSlots = this.state.maxSlots;
	      function callSuccess() {
	        connectCount++;
	        if (connectCount < maxSlots && position > 0) {
	          this.establishConnection.bind(this)(list, position - 1, connectCount);
	        }
	      }
	      function callFailure(errorCode, errorText) {
	        easyrtc.showError(errorCode, errorText);
	        if (connectCount < maxSlots && position > 0) {
	          this.establishConnection.bind(this)(list, position - 1, connectCount);
	        }
	      }
	      easyrtc.call(list[position], callSuccess, callFailure);
	    }
	  }, {
	    key: 'callEverybodyElse',
	    value: function callEverybodyElse(roomName, otherPeople, myInfo) {
	      var _this3 = this;
	
	      easyrtc.setRoomOccupantListener(null); // so we're only called once.
	
	      var list = [];
	      for (var easyrtcid in otherPeople) {
	        list.push(easyrtcid);
	      }
	
	      if (list.length > 0) {
	        this.setState({ name: roomName, others: list }, function () {
	          _this3.establishConnection.bind(_this3)(list, list.length - 1, 0);
	        });
	      } else {
	        this.setState({ name: roomName, others: [] });
	      }
	    }
	  }, {
	    key: 'handleHangup',
	    value: function handleHangup(easyrtcid, slot) {
	      console.log(easyrtcid);
	      var availableSlots = this.state.availableSlots + 1;
	      var videos = this.state.videos;
	      var foundVideo = _import2['default'].findWhere(videos, { easyrtcid: easyrtcid });
	      var index = _import2['default'].indexOf(videos, foundVideo);
	      videos[index] = { filled: true, order: index };
	      this.setState({
	        videos: videos,
	        availableSlots: availableSlots
	      });
	    }
	  }, {
	    key: 'handleDisconnect',
	    value: function handleDisconnect() {
	      easyrtc.showError('LOST-CONNECTION', 'Lost connection to signaling server');
	    }
	  }, {
	    key: 'loginSuccess',
	    value: function loginSuccess(easyrtcid) {
	      var videos = this.state.videos;
	      videos[0] = { easyrtcid: easyrtcid, filled: true, order: 0 };
	      var availableSlots = this.state.maxSlots - 1;
	      this.setState({
	        videos: videos,
	        availableSlots: availableSlots
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var videos = this.state.videos.sort(_sortBy2['default']('order')).map(function (videoData, i) {
	        var className = videoData.filled ? 'CameraPreview' : 'CameraPreview Hidden';
	        var optionalProps = {};
	        if (videoData.stream) {
	          var vendorURL = window.URL || window.webkitURL;
	          optionalProps.src = vendorURL.createObjectURL(videoData.stream);
	          optionalProps.autoPlay = true;
	        }
	        return _React2['default'].createElement('video', _extends({ ref: 'video' + videoData.easyrtcid, id: 'video' + i }, optionalProps, {
	          key: videoData.easyrtcid, className: className }));
	      });
	
	      return _React2['default'].createElement(
	        'div',
	        { className: 'Home' },
	        _React2['default'].createElement(
	          'h1',
	          null,
	          'Room: ',
	          this.state.name
	        ),
	        _React2['default'].createElement(
	          'div',
	          { className: 'Videos' },
	          videos
	        )
	      );
	    }
	  }]);
	
	  return Home;
	})(_React2['default'].Component);
	
	Home.propTypes = {};
	
	Home.displayName = 'Home';
	
	exports['default'] = _Resolver.Resolver.createContainer(Home, {
	  resolve: {} });
	module.exports = exports['default'];

	// promise: React.PropTypes.string.isRequired,

	/*
	promise() {
	  return PromiseStore.find(this.getParams().id);
	}
	*/

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(42)['default'];
	
	var _createClass = __webpack_require__(43)['default'];
	
	var _classCallCheck = __webpack_require__(44)['default'];
	
	var _Object$defineProperty = __webpack_require__(16)['default'];
	
	var _interopRequireDefault = __webpack_require__(12)['default'];
	
	_Object$defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _React = __webpack_require__(2);
	
	var _React2 = _interopRequireDefault(_React);
	
	var _RouteHandler = __webpack_require__(15);
	
	/** @flow */
	'use strict';
	
	__webpack_require__(49);
	
	var NotFound = (function (_React$Component) {
	  function NotFound() {
	    _classCallCheck(this, NotFound);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(NotFound, _React$Component);
	
	  _createClass(NotFound, [{
	    key: 'render',
	    value: function render() {
	      return _React2['default'].createElement(
	        'div',
	        null,
	        'Welcome NotFound',
	        _React2['default'].createElement(_RouteHandler.RouteHandler, null)
	      );
	    }
	  }]);
	
	  return NotFound;
	})(_React2['default'].Component);
	
	exports['default'] = NotFound;
	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("lodash");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("sort-by");

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$create = __webpack_require__(50)["default"];
	
	var _inherits = function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }subClass.prototype = _Object$create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	};
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var PropTypes = __webpack_require__(51);
	var RouteHandler = __webpack_require__(27);
	var Route = __webpack_require__(26);
	
	/**
	 * A <DefaultRoute> component is a special kind of <Route> that
	 * renders when its parent matches but none of its siblings do.
	 * Only one such route may be used at any given level in the
	 * route hierarchy.
	 */
	
	var DefaultRoute = (function (_Route) {
	  function DefaultRoute() {
	    _classCallCheck(this, DefaultRoute);
	
	    if (_Route != null) {
	      _Route.apply(this, arguments);
	    }
	  }
	
	  _inherits(DefaultRoute, _Route);
	
	  return DefaultRoute;
	})(Route);
	
	// TODO: Include these in the above class definition
	// once we can use ES7 property initializers.
	// https://github.com/babel/babel/issues/619
	
	DefaultRoute.propTypes = {
	  name: PropTypes.string,
	  path: PropTypes.falsy,
	  children: PropTypes.falsy,
	  handler: PropTypes.func.isRequired
	};
	
	DefaultRoute.defaultProps = {
	  handler: RouteHandler
	};
	
	module.exports = DefaultRoute;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperties = __webpack_require__(52)["default"];
	
	var _Object$create = __webpack_require__(50)["default"];
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var key in props) {
	      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
	    }_Object$defineProperties(target, props);
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _inherits = function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }subClass.prototype = _Object$create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	};
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var React = __webpack_require__(2);
	var assign = __webpack_require__(64);
	var PropTypes = __webpack_require__(51);
	
	function isLeftClickEvent(event) {
	  return event.button === 0;
	}
	
	function isModifiedEvent(event) {
	  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
	}
	
	/**
	 * <Link> components are used to create an <a> element that links to a route.
	 * When that route is active, the link gets an "active" class name (or the
	 * value of its `activeClassName` prop).
	 *
	 * For example, assuming you have the following route:
	 *
	 *   <Route name="showPost" path="/posts/:postID" handler={Post}/>
	 *
	 * You could use the following component to link to that route:
	 *
	 *   <Link to="showPost" params={{ postID: "123" }} />
	 *
	 * In addition to params, links may pass along query string parameters
	 * using the `query` prop.
	 *
	 *   <Link to="showPost" params={{ postID: "123" }} query={{ show:true }}/>
	 */
	
	var Link = (function (_React$Component) {
	  function Link() {
	    _classCallCheck(this, Link);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(Link, _React$Component);
	
	  _createClass(Link, {
	    handleClick: {
	      value: function handleClick(event) {
	        var allowTransition = true;
	        var clickResult;
	
	        if (this.props.onClick) clickResult = this.props.onClick(event);
	
	        if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
	          return;
	        }if (clickResult === false || event.defaultPrevented === true) allowTransition = false;
	
	        event.preventDefault();
	
	        if (allowTransition) this.context.router.transitionTo(this.props.to, this.props.params, this.props.query);
	      }
	    },
	    getHref: {
	
	      /**
	       * Returns the value of the "href" attribute to use on the DOM element.
	       */
	
	      value: function getHref() {
	        return this.context.router.makeHref(this.props.to, this.props.params, this.props.query);
	      }
	    },
	    getClassName: {
	
	      /**
	       * Returns the value of the "class" attribute to use on the DOM element, which contains
	       * the value of the activeClassName property when this <Link> is active.
	       */
	
	      value: function getClassName() {
	        var className = this.props.className;
	
	        if (this.getActiveState()) className += " " + this.props.activeClassName;
	
	        return className;
	      }
	    },
	    getActiveState: {
	      value: function getActiveState() {
	        return this.context.router.isActive(this.props.to, this.props.params, this.props.query);
	      }
	    },
	    render: {
	      value: function render() {
	        var props = assign({}, this.props, {
	          href: this.getHref(),
	          className: this.getClassName(),
	          onClick: this.handleClick.bind(this)
	        });
	
	        if (props.activeStyle && this.getActiveState()) props.style = props.activeStyle;
	
	        return React.DOM.a(props, this.props.children);
	      }
	    }
	  });
	
	  return Link;
	})(React.Component);
	
	// TODO: Include these in the above class definition
	// once we can use ES7 property initializers.
	// https://github.com/babel/babel/issues/619
	
	Link.contextTypes = {
	  router: PropTypes.router.isRequired
	};
	
	Link.propTypes = {
	  activeClassName: PropTypes.string.isRequired,
	  to: PropTypes.oneOfType([PropTypes.string, PropTypes.route]).isRequired,
	  params: PropTypes.object,
	  query: PropTypes.object,
	  activeStyle: PropTypes.object,
	  onClick: PropTypes.func
	};
	
	Link.defaultProps = {
	  activeClassName: "active",
	  className: ""
	};
	
	module.exports = Link;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$create = __webpack_require__(50)["default"];
	
	var _inherits = function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }subClass.prototype = _Object$create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	};
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var PropTypes = __webpack_require__(51);
	var RouteHandler = __webpack_require__(27);
	var Route = __webpack_require__(26);
	
	/**
	 * A <NotFoundRoute> is a special kind of <Route> that
	 * renders when the beginning of its parent's path matches
	 * but none of its siblings do, including any <DefaultRoute>.
	 * Only one such route may be used at any given level in the
	 * route hierarchy.
	 */
	
	var NotFoundRoute = (function (_Route) {
	  function NotFoundRoute() {
	    _classCallCheck(this, NotFoundRoute);
	
	    if (_Route != null) {
	      _Route.apply(this, arguments);
	    }
	  }
	
	  _inherits(NotFoundRoute, _Route);
	
	  return NotFoundRoute;
	})(Route);
	
	// TODO: Include these in the above class definition
	// once we can use ES7 property initializers.
	// https://github.com/babel/babel/issues/619
	
	NotFoundRoute.propTypes = {
	  name: PropTypes.string,
	  path: PropTypes.falsy,
	  children: PropTypes.falsy,
	  handler: PropTypes.func.isRequired
	};
	
	NotFoundRoute.defaultProps = {
	  handler: RouteHandler
	};
	
	module.exports = NotFoundRoute;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$create = __webpack_require__(50)["default"];
	
	var _inherits = function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }subClass.prototype = _Object$create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	};
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var PropTypes = __webpack_require__(51);
	var Route = __webpack_require__(26);
	
	/**
	 * A <Redirect> component is a special kind of <Route> that always
	 * redirects to another route when it matches.
	 */
	
	var Redirect = (function (_Route) {
	  function Redirect() {
	    _classCallCheck(this, Redirect);
	
	    if (_Route != null) {
	      _Route.apply(this, arguments);
	    }
	  }
	
	  _inherits(Redirect, _Route);
	
	  return Redirect;
	})(Route);
	
	// TODO: Include these in the above class definition
	// once we can use ES7 property initializers.
	// https://github.com/babel/babel/issues/619
	
	Redirect.propTypes = {
	  path: PropTypes.string,
	  from: PropTypes.string, // Alias for path.
	  to: PropTypes.string,
	  handler: PropTypes.falsy
	};
	
	// Redirects should not have a default handler
	Redirect.defaultProps = {};
	
	module.exports = Redirect;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperties = __webpack_require__(52)["default"];
	
	var _Object$create = __webpack_require__(50)["default"];
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var key in props) {
	      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
	    }_Object$defineProperties(target, props);
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _inherits = function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }subClass.prototype = _Object$create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	};
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var React = __webpack_require__(2);
	var invariant = __webpack_require__(65);
	var PropTypes = __webpack_require__(51);
	var RouteHandler = __webpack_require__(27);
	
	/**
	 * <Route> components specify components that are rendered to the page when the
	 * URL matches a given pattern.
	 *
	 * Routes are arranged in a nested tree structure. When a new URL is requested,
	 * the tree is searched depth-first to find a route whose path matches the URL.
	 * When one is found, all routes in the tree that lead to it are considered
	 * "active" and their components are rendered into the DOM, nested in the same
	 * order as they are in the tree.
	 *
	 * The preferred way to configure a router is using JSX. The XML-like syntax is
	 * a great way to visualize how routes are laid out in an application.
	 *
	 *   var routes = [
	 *     <Route handler={App}>
	 *       <Route name="login" handler={Login}/>
	 *       <Route name="logout" handler={Logout}/>
	 *       <Route name="about" handler={About}/>
	 *     </Route>
	 *   ];
	 *   
	 *   Router.run(routes, function (Handler) {
	 *     React.render(<Handler/>, document.body);
	 *   });
	 *
	 * Handlers for Route components that contain children can render their active
	 * child route using a <RouteHandler> element.
	 *
	 *   var App = React.createClass({
	 *     render: function () {
	 *       return (
	 *         <div class="application">
	 *           <RouteHandler/>
	 *         </div>
	 *       );
	 *     }
	 *   });
	 *
	 * If no handler is provided for the route, it will render a matched child route.
	 */
	
	var Route = (function (_React$Component) {
	  function Route() {
	    _classCallCheck(this, Route);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(Route, _React$Component);
	
	  _createClass(Route, {
	    render: {
	      value: function render() {
	        invariant(false, "%s elements are for router configuration only and should not be rendered", this.constructor.name);
	      }
	    }
	  });
	
	  return Route;
	})(React.Component);
	
	// TODO: Include these in the above class definition
	// once we can use ES7 property initializers.
	// https://github.com/babel/babel/issues/619
	
	Route.propTypes = {
	  name: PropTypes.string,
	  path: PropTypes.string,
	  handler: PropTypes.func,
	  ignoreScrollBehavior: PropTypes.bool
	};
	
	Route.defaultProps = {
	  handler: RouteHandler
	};
	
	module.exports = Route;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperties = __webpack_require__(52)["default"];
	
	var _Object$create = __webpack_require__(50)["default"];
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var key in props) {
	      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
	    }_Object$defineProperties(target, props);
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _inherits = function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }subClass.prototype = _Object$create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	};
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var React = __webpack_require__(2);
	var ContextWrapper = __webpack_require__(53);
	var assign = __webpack_require__(64);
	var PropTypes = __webpack_require__(51);
	
	var REF_NAME = "__routeHandler__";
	
	/**
	 * A <RouteHandler> component renders the active child route handler
	 * when routes are nested.
	 */
	
	var RouteHandler = (function (_React$Component) {
	  function RouteHandler() {
	    _classCallCheck(this, RouteHandler);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(RouteHandler, _React$Component);
	
	  _createClass(RouteHandler, {
	    getChildContext: {
	      value: function getChildContext() {
	        return {
	          routeDepth: this.context.routeDepth + 1
	        };
	      }
	    },
	    componentDidMount: {
	      value: function componentDidMount() {
	        this._updateRouteComponent(this.refs[REF_NAME]);
	      }
	    },
	    componentDidUpdate: {
	      value: function componentDidUpdate() {
	        this._updateRouteComponent(this.refs[REF_NAME]);
	      }
	    },
	    componentWillUnmount: {
	      value: function componentWillUnmount() {
	        this._updateRouteComponent(null);
	      }
	    },
	    _updateRouteComponent: {
	      value: function _updateRouteComponent(component) {
	        this.context.router.setRouteComponentAtDepth(this.getRouteDepth(), component);
	      }
	    },
	    getRouteDepth: {
	      value: function getRouteDepth() {
	        return this.context.routeDepth;
	      }
	    },
	    createChildRouteHandler: {
	      value: function createChildRouteHandler(props) {
	        var route = this.context.router.getRouteAtDepth(this.getRouteDepth());
	        return route ? React.createElement(route.handler, assign({}, props || this.props, { ref: REF_NAME })) : null;
	      }
	    },
	    render: {
	      value: function render() {
	        var handler = this.createChildRouteHandler();
	        // <script/> for things like <CSSTransitionGroup/> that don't like null
	        return handler ? React.createElement(ContextWrapper, null, handler) : React.createElement("script", null);
	      }
	    }
	  });
	
	  return RouteHandler;
	})(React.Component);
	
	// TODO: Include these in the above class definition
	// once we can use ES7 property initializers.
	// https://github.com/babel/babel/issues/619
	
	RouteHandler.contextTypes = {
	  routeDepth: PropTypes.number.isRequired,
	  router: PropTypes.router.isRequired
	};
	
	RouteHandler.childContextTypes = {
	  routeDepth: PropTypes.number.isRequired
	};
	
	module.exports = RouteHandler;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var LocationActions = __webpack_require__(54);
	var History = __webpack_require__(35);
	
	var _listeners = [];
	var _isListening = false;
	var _actionType;
	
	function notifyChange(type) {
	  if (type === LocationActions.PUSH) History.length += 1;
	
	  var change = {
	    path: HashLocation.getCurrentPath(),
	    type: type
	  };
	
	  _listeners.forEach(function (listener) {
	    listener.call(HashLocation, change);
	  });
	}
	
	function ensureSlash() {
	  var path = HashLocation.getCurrentPath();
	
	  if (path.charAt(0) === "/") {
	    return true;
	  }HashLocation.replace("/" + path);
	
	  return false;
	}
	
	function onHashChange() {
	  if (ensureSlash()) {
	    // If we don't have an _actionType then all we know is the hash
	    // changed. It was probably caused by the user clicking the Back
	    // button, but may have also been the Forward button or manual
	    // manipulation. So just guess 'pop'.
	    var curActionType = _actionType;
	    _actionType = null;
	    notifyChange(curActionType || LocationActions.POP);
	  }
	}
	
	/**
	 * A Location that uses `window.location.hash`.
	 */
	var HashLocation = {
	
	  addChangeListener: function addChangeListener(listener) {
	    _listeners.push(listener);
	
	    // Do this BEFORE listening for hashchange.
	    ensureSlash();
	
	    if (!_isListening) {
	      if (window.addEventListener) {
	        window.addEventListener("hashchange", onHashChange, false);
	      } else {
	        window.attachEvent("onhashchange", onHashChange);
	      }
	
	      _isListening = true;
	    }
	  },
	
	  removeChangeListener: function removeChangeListener(listener) {
	    _listeners = _listeners.filter(function (l) {
	      return l !== listener;
	    });
	
	    if (_listeners.length === 0) {
	      if (window.removeEventListener) {
	        window.removeEventListener("hashchange", onHashChange, false);
	      } else {
	        window.removeEvent("onhashchange", onHashChange);
	      }
	
	      _isListening = false;
	    }
	  },
	
	  push: function push(path) {
	    _actionType = LocationActions.PUSH;
	    window.location.hash = path;
	  },
	
	  replace: function replace(path) {
	    _actionType = LocationActions.REPLACE;
	    window.location.replace(window.location.pathname + window.location.search + "#" + path);
	  },
	
	  pop: function pop() {
	    _actionType = LocationActions.POP;
	    History.back();
	  },
	
	  getCurrentPath: function getCurrentPath() {
	    return decodeURI(
	    // We can't use window.location.hash here because it's not
	    // consistent across browsers - Firefox will pre-decode it!
	    window.location.href.split("#")[1] || "");
	  },
	
	  toString: function toString() {
	    return "<HashLocation>";
	  }
	
	};
	
	module.exports = HashLocation;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var LocationActions = __webpack_require__(54);
	var History = __webpack_require__(35);
	
	var _listeners = [];
	var _isListening = false;
	
	function notifyChange(type) {
	  var change = {
	    path: HistoryLocation.getCurrentPath(),
	    type: type
	  };
	
	  _listeners.forEach(function (listener) {
	    listener.call(HistoryLocation, change);
	  });
	}
	
	function onPopState(event) {
	  if (event.state === undefined) {
	    return;
	  } // Ignore extraneous popstate events in WebKit.
	
	  notifyChange(LocationActions.POP);
	}
	
	/**
	 * A Location that uses HTML5 history.
	 */
	var HistoryLocation = {
	
	  addChangeListener: function addChangeListener(listener) {
	    _listeners.push(listener);
	
	    if (!_isListening) {
	      if (window.addEventListener) {
	        window.addEventListener("popstate", onPopState, false);
	      } else {
	        window.attachEvent("onpopstate", onPopState);
	      }
	
	      _isListening = true;
	    }
	  },
	
	  removeChangeListener: function removeChangeListener(listener) {
	    _listeners = _listeners.filter(function (l) {
	      return l !== listener;
	    });
	
	    if (_listeners.length === 0) {
	      if (window.addEventListener) {
	        window.removeEventListener("popstate", onPopState, false);
	      } else {
	        window.removeEvent("onpopstate", onPopState);
	      }
	
	      _isListening = false;
	    }
	  },
	
	  push: function push(path) {
	    window.history.pushState({ path: path }, "", path);
	    History.length += 1;
	    notifyChange(LocationActions.PUSH);
	  },
	
	  replace: function replace(path) {
	    window.history.replaceState({ path: path }, "", path);
	    notifyChange(LocationActions.REPLACE);
	  },
	
	  pop: History.back,
	
	  getCurrentPath: function getCurrentPath() {
	    return decodeURI(window.location.pathname + window.location.search);
	  },
	
	  toString: function toString() {
	    return "<HistoryLocation>";
	  }
	
	};
	
	module.exports = HistoryLocation;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var HistoryLocation = __webpack_require__(29);
	var History = __webpack_require__(35);
	
	/**
	 * A Location that uses full page refreshes. This is used as
	 * the fallback for HistoryLocation in browsers that do not
	 * support the HTML5 history API.
	 */
	var RefreshLocation = {
	
	  push: function push(path) {
	    window.location = path;
	  },
	
	  replace: function replace(path) {
	    window.location.replace(path);
	  },
	
	  pop: History.back,
	
	  getCurrentPath: HistoryLocation.getCurrentPath,
	
	  toString: function toString() {
	    return "<RefreshLocation>";
	  }
	
	};
	
	module.exports = RefreshLocation;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperties = __webpack_require__(52)["default"];
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var key in props) {
	      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
	    }_Object$defineProperties(target, props);
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var invariant = __webpack_require__(65);
	
	function throwCannotModify() {
	  invariant(false, "You cannot modify a static location");
	}
	
	/**
	 * A location that only ever contains a single path. Useful in
	 * stateless environments like servers where there is no path history,
	 * only the path that was used in the request.
	 */
	
	var StaticLocation = (function () {
	  function StaticLocation(path) {
	    _classCallCheck(this, StaticLocation);
	
	    this.path = path;
	  }
	
	  _createClass(StaticLocation, {
	    getCurrentPath: {
	      value: function getCurrentPath() {
	        return this.path;
	      }
	    },
	    toString: {
	      value: function toString() {
	        return "<StaticLocation path=\"" + this.path + "\">";
	      }
	    }
	  });
	
	  return StaticLocation;
	})();
	
	// TODO: Include these in the above class definition
	// once we can use ES7 property initializers.
	// https://github.com/babel/babel/issues/619
	
	StaticLocation.prototype.push = throwCannotModify;
	StaticLocation.prototype.replace = throwCannotModify;
	StaticLocation.prototype.pop = throwCannotModify;
	
	module.exports = StaticLocation;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperties = __webpack_require__(52)["default"];
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var key in props) {
	      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
	    }_Object$defineProperties(target, props);
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var invariant = __webpack_require__(65);
	var LocationActions = __webpack_require__(54);
	var History = __webpack_require__(35);
	
	/**
	 * A location that is convenient for testing and does not require a DOM.
	 */
	
	var TestLocation = (function () {
	  function TestLocation(history) {
	    _classCallCheck(this, TestLocation);
	
	    this.history = history || [];
	    this.listeners = [];
	    this._updateHistoryLength();
	  }
	
	  _createClass(TestLocation, {
	    needsDOM: {
	      get: function get() {
	        return false;
	      }
	    },
	    _updateHistoryLength: {
	      value: function _updateHistoryLength() {
	        History.length = this.history.length;
	      }
	    },
	    _notifyChange: {
	      value: function _notifyChange(type) {
	        var change = {
	          path: this.getCurrentPath(),
	          type: type
	        };
	
	        for (var i = 0, len = this.listeners.length; i < len; ++i) this.listeners[i].call(this, change);
	      }
	    },
	    addChangeListener: {
	      value: function addChangeListener(listener) {
	        this.listeners.push(listener);
	      }
	    },
	    removeChangeListener: {
	      value: function removeChangeListener(listener) {
	        this.listeners = this.listeners.filter(function (l) {
	          return l !== listener;
	        });
	      }
	    },
	    push: {
	      value: function push(path) {
	        this.history.push(path);
	        this._updateHistoryLength();
	        this._notifyChange(LocationActions.PUSH);
	      }
	    },
	    replace: {
	      value: function replace(path) {
	        invariant(this.history.length, "You cannot replace the current path with no history");
	
	        this.history[this.history.length - 1] = path;
	
	        this._notifyChange(LocationActions.REPLACE);
	      }
	    },
	    pop: {
	      value: function pop() {
	        this.history.pop();
	        this._updateHistoryLength();
	        this._notifyChange(LocationActions.POP);
	      }
	    },
	    getCurrentPath: {
	      value: function getCurrentPath() {
	        return this.history[this.history.length - 1];
	      }
	    },
	    toString: {
	      value: function toString() {
	        return "<TestLocation>";
	      }
	    }
	  });
	
	  return TestLocation;
	})();
	
	module.exports = TestLocation;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var LocationActions = __webpack_require__(54);
	
	/**
	 * A scroll behavior that attempts to imitate the default behavior
	 * of modern browsers.
	 */
	var ImitateBrowserBehavior = {
	
	  updateScrollPosition: function updateScrollPosition(position, actionType) {
	    switch (actionType) {
	      case LocationActions.PUSH:
	      case LocationActions.REPLACE:
	        window.scrollTo(0, 0);
	        break;
	      case LocationActions.POP:
	        if (position) {
	          window.scrollTo(position.x, position.y);
	        } else {
	          window.scrollTo(0, 0);
	        }
	        break;
	    }
	  }
	
	};
	
	module.exports = ImitateBrowserBehavior;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * A scroll behavior that always scrolls to the top of the page
	 * after a transition.
	 */
	var ScrollToTopBehavior = {
	
	  updateScrollPosition: function updateScrollPosition() {
	    window.scrollTo(0, 0);
	  }
	
	};
	
	module.exports = ScrollToTopBehavior;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var invariant = __webpack_require__(65);
	var canUseDOM = __webpack_require__(67).canUseDOM;
	
	var History = {
	
	  /**
	   * The current number of entries in the history.
	   *
	   * Note: This property is read-only.
	   */
	  length: 1,
	
	  /**
	   * Sends the browser back one entry in the history.
	   */
	  back: function back() {
	    invariant(canUseDOM, "Cannot use History.back without a DOM");
	
	    // Do this first so that History.length will
	    // be accurate in location change listeners.
	    History.length -= 1;
	
	    window.history.back();
	  }
	
	};
	
	module.exports = History;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var warning = __webpack_require__(66);
	var PropTypes = __webpack_require__(51);
	
	function deprecatedMethod(routerMethodName, fn) {
	  return function () {
	    warning(false, "Router.Navigation is deprecated. Please use this.context.router." + routerMethodName + "() instead");
	
	    return fn.apply(this, arguments);
	  };
	}
	
	/**
	 * A mixin for components that modify the URL.
	 *
	 * Example:
	 *
	 *   var MyLink = React.createClass({
	 *     mixins: [ Router.Navigation ],
	 *     handleClick(event) {
	 *       event.preventDefault();
	 *       this.transitionTo('aRoute', { the: 'params' }, { the: 'query' });
	 *     },
	 *     render() {
	 *       return (
	 *         <a onClick={this.handleClick}>Click me!</a>
	 *       );
	 *     }
	 *   });
	 */
	var Navigation = {
	
	  contextTypes: {
	    router: PropTypes.router.isRequired
	  },
	
	  /**
	   * Returns an absolute URL path created from the given route
	   * name, URL parameters, and query values.
	   */
	  makePath: deprecatedMethod("makePath", function (to, params, query) {
	    return this.context.router.makePath(to, params, query);
	  }),
	
	  /**
	   * Returns a string that may safely be used as the href of a
	   * link to the route with the given name.
	   */
	  makeHref: deprecatedMethod("makeHref", function (to, params, query) {
	    return this.context.router.makeHref(to, params, query);
	  }),
	
	  /**
	   * Transitions to the URL specified in the arguments by pushing
	   * a new URL onto the history stack.
	   */
	  transitionTo: deprecatedMethod("transitionTo", function (to, params, query) {
	    this.context.router.transitionTo(to, params, query);
	  }),
	
	  /**
	   * Transitions to the URL specified in the arguments by replacing
	   * the current URL in the history stack.
	   */
	  replaceWith: deprecatedMethod("replaceWith", function (to, params, query) {
	    this.context.router.replaceWith(to, params, query);
	  }),
	
	  /**
	   * Transitions to the previous URL.
	   */
	  goBack: deprecatedMethod("goBack", function () {
	    return this.context.router.goBack();
	  })
	
	};
	
	module.exports = Navigation;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var warning = __webpack_require__(66);
	var PropTypes = __webpack_require__(51);
	
	function deprecatedMethod(routerMethodName, fn) {
	  return function () {
	    warning(false, "Router.State is deprecated. Please use this.context.router." + routerMethodName + "() instead");
	
	    return fn.apply(this, arguments);
	  };
	}
	
	/**
	 * A mixin for components that need to know the path, routes, URL
	 * params and query that are currently active.
	 *
	 * Example:
	 *
	 *   var AboutLink = React.createClass({
	 *     mixins: [ Router.State ],
	 *     render() {
	 *       var className = this.props.className;
	 *   
	 *       if (this.isActive('about'))
	 *         className += ' is-active';
	 *   
	 *       return React.DOM.a({ className: className }, this.props.children);
	 *     }
	 *   });
	 */
	var State = {
	
	  contextTypes: {
	    router: PropTypes.router.isRequired
	  },
	
	  /**
	   * Returns the current URL path.
	   */
	  getPath: deprecatedMethod("getCurrentPath", function () {
	    return this.context.router.getCurrentPath();
	  }),
	
	  /**
	   * Returns the current URL path without the query string.
	   */
	  getPathname: deprecatedMethod("getCurrentPathname", function () {
	    return this.context.router.getCurrentPathname();
	  }),
	
	  /**
	   * Returns an object of the URL params that are currently active.
	   */
	  getParams: deprecatedMethod("getCurrentParams", function () {
	    return this.context.router.getCurrentParams();
	  }),
	
	  /**
	   * Returns an object of the query params that are currently active.
	   */
	  getQuery: deprecatedMethod("getCurrentQuery", function () {
	    return this.context.router.getCurrentQuery();
	  }),
	
	  /**
	   * Returns an array of the routes that are currently active.
	   */
	  getRoutes: deprecatedMethod("getCurrentRoutes", function () {
	    return this.context.router.getCurrentRoutes();
	  }),
	
	  /**
	   * A helper method to determine if a given route, params, and query
	   * are active.
	   */
	  isActive: deprecatedMethod("isActive", function (to, params, query) {
	    return this.context.router.isActive(to, params, query);
	  })
	
	};
	
	module.exports = State;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperties = __webpack_require__(52)["default"];
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var key in props) {
	      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
	    }_Object$defineProperties(target, props);
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	var assign = __webpack_require__(64);
	var invariant = __webpack_require__(65);
	var warning = __webpack_require__(66);
	var PathUtils = __webpack_require__(55);
	
	var _currentRoute;
	
	var Route = (function () {
	  function Route(name, path, ignoreScrollBehavior, isDefault, isNotFound, onEnter, onLeave, handler) {
	    _classCallCheck(this, Route);
	
	    this.name = name;
	    this.path = path;
	    this.paramNames = PathUtils.extractParamNames(this.path);
	    this.ignoreScrollBehavior = !!ignoreScrollBehavior;
	    this.isDefault = !!isDefault;
	    this.isNotFound = !!isNotFound;
	    this.onEnter = onEnter;
	    this.onLeave = onLeave;
	    this.handler = handler;
	  }
	
	  _createClass(Route, {
	    appendChild: {
	
	      /**
	       * Appends the given route to this route's child routes.
	       */
	
	      value: function appendChild(route) {
	        invariant(route instanceof Route, "route.appendChild must use a valid Route");
	
	        if (!this.childRoutes) this.childRoutes = [];
	
	        this.childRoutes.push(route);
	      }
	    },
	    toString: {
	      value: function toString() {
	        var string = "<Route";
	
	        if (this.name) string += " name=\"" + this.name + "\"";
	
	        string += " path=\"" + this.path + "\">";
	
	        return string;
	      }
	    }
	  }, {
	    createRoute: {
	
	      /**
	       * Creates and returns a new route. Options may be a URL pathname string
	       * with placeholders for named params or an object with any of the following
	       * properties:
	       *
	       * - name                     The name of the route. This is used to lookup a
	       *                            route relative to its parent route and should be
	       *                            unique among all child routes of the same parent
	       * - path                     A URL pathname string with optional placeholders
	       *                            that specify the names of params to extract from
	       *                            the URL when the path matches. Defaults to `/${name}`
	       *                            when there is a name given, or the path of the parent
	       *                            route, or /
	       * - ignoreScrollBehavior     True to make this route (and all descendants) ignore
	       *                            the scroll behavior of the router
	       * - isDefault                True to make this route the default route among all
	       *                            its siblings
	       * - isNotFound               True to make this route the "not found" route among
	       *                            all its siblings
	       * - onEnter                  A transition hook that will be called when the
	       *                            router is going to enter this route
	       * - onLeave                  A transition hook that will be called when the
	       *                            router is going to leave this route
	       * - handler                  A React component that will be rendered when
	       *                            this route is active
	       * - parentRoute              The parent route to use for this route. This option
	       *                            is automatically supplied when creating routes inside
	       *                            the callback to another invocation of createRoute. You
	       *                            only ever need to use this when declaring routes
	       *                            independently of one another to manually piece together
	       *                            the route hierarchy
	       *
	       * The callback may be used to structure your route hierarchy. Any call to
	       * createRoute, createDefaultRoute, createNotFoundRoute, or createRedirect
	       * inside the callback automatically uses this route as its parent.
	       */
	
	      value: function createRoute(options, callback) {
	        options = options || {};
	
	        if (typeof options === "string") options = { path: options };
	
	        var parentRoute = _currentRoute;
	
	        if (parentRoute) {
	          warning(options.parentRoute == null || options.parentRoute === parentRoute, "You should not use parentRoute with createRoute inside another route's child callback; it is ignored");
	        } else {
	          parentRoute = options.parentRoute;
	        }
	
	        var name = options.name;
	        var path = options.path || name;
	
	        if (path && !(options.isDefault || options.isNotFound)) {
	          if (PathUtils.isAbsolute(path)) {
	            if (parentRoute) {
	              invariant(path === parentRoute.path || parentRoute.paramNames.length === 0, "You cannot nest path \"%s\" inside \"%s\"; the parent requires URL parameters", path, parentRoute.path);
	            }
	          } else if (parentRoute) {
	            // Relative paths extend their parent.
	            path = PathUtils.join(parentRoute.path, path);
	          } else {
	            path = "/" + path;
	          }
	        } else {
	          path = parentRoute ? parentRoute.path : "/";
	        }
	
	        if (options.isNotFound && !/\*$/.test(path)) path += "*"; // Auto-append * to the path of not found routes.
	
	        var route = new Route(name, path, options.ignoreScrollBehavior, options.isDefault, options.isNotFound, options.onEnter, options.onLeave, options.handler);
	
	        if (parentRoute) {
	          if (route.isDefault) {
	            invariant(parentRoute.defaultRoute == null, "%s may not have more than one default route", parentRoute);
	
	            parentRoute.defaultRoute = route;
	          } else if (route.isNotFound) {
	            invariant(parentRoute.notFoundRoute == null, "%s may not have more than one not found route", parentRoute);
	
	            parentRoute.notFoundRoute = route;
	          }
	
	          parentRoute.appendChild(route);
	        }
	
	        // Any routes created in the callback
	        // use this route as their parent.
	        if (typeof callback === "function") {
	          var currentRoute = _currentRoute;
	          _currentRoute = route;
	          callback.call(route, route);
	          _currentRoute = currentRoute;
	        }
	
	        return route;
	      }
	    },
	    createDefaultRoute: {
	
	      /**
	       * Creates and returns a route that is rendered when its parent matches
	       * the current URL.
	       */
	
	      value: function createDefaultRoute(options) {
	        return Route.createRoute(assign({}, options, { isDefault: true }));
	      }
	    },
	    createNotFoundRoute: {
	
	      /**
	       * Creates and returns a route that is rendered when its parent matches
	       * the current URL but none of its siblings do.
	       */
	
	      value: function createNotFoundRoute(options) {
	        return Route.createRoute(assign({}, options, { isNotFound: true }));
	      }
	    },
	    createRedirect: {
	
	      /**
	       * Creates and returns a route that automatically redirects the transition
	       * to another route. In addition to the normal options to createRoute, this
	       * function accepts the following options:
	       *
	       * - from         An alias for the `path` option. Defaults to *
	       * - to           The path/route/route name to redirect to
	       * - params       The params to use in the redirect URL. Defaults
	       *                to using the current params
	       * - query        The query to use in the redirect URL. Defaults
	       *                to using the current query
	       */
	
	      value: function createRedirect(options) {
	        return Route.createRoute(assign({}, options, {
	          path: options.path || options.from || "*",
	          onEnter: function onEnter(transition, params, query) {
	            transition.redirect(options.to, options.params || params, options.query || query);
	          }
	        }));
	      }
	    }
	  });
	
	  return Route;
	})();
	
	module.exports = Route;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/* jshint -W084 */
	var React = __webpack_require__(2);
	var assign = __webpack_require__(64);
	var warning = __webpack_require__(66);
	var DefaultRoute = __webpack_require__(22);
	var NotFoundRoute = __webpack_require__(24);
	var Redirect = __webpack_require__(25);
	var Route = __webpack_require__(38);
	
	function checkPropTypes(componentName, propTypes, props) {
	  componentName = componentName || "UnknownComponent";
	
	  for (var propName in propTypes) {
	    if (propTypes.hasOwnProperty(propName)) {
	      var error = propTypes[propName](props, propName, componentName);
	
	      if (error instanceof Error) warning(false, error.message);
	    }
	  }
	}
	
	function createRouteOptions(props) {
	  var options = assign({}, props);
	  var handler = options.handler;
	
	  if (handler) {
	    options.onEnter = handler.willTransitionTo;
	    options.onLeave = handler.willTransitionFrom;
	  }
	
	  return options;
	}
	
	function createRouteFromReactElement(element) {
	  if (!React.isValidElement(element)) {
	    return;
	  }var type = element.type;
	  var props = assign({}, type.defaultProps, element.props);
	
	  if (type.propTypes) checkPropTypes(type.displayName, type.propTypes, props);
	
	  if (type === DefaultRoute) {
	    return Route.createDefaultRoute(createRouteOptions(props));
	  }if (type === NotFoundRoute) {
	    return Route.createNotFoundRoute(createRouteOptions(props));
	  }if (type === Redirect) {
	    return Route.createRedirect(createRouteOptions(props));
	  }return Route.createRoute(createRouteOptions(props), function () {
	    if (props.children) createRoutesFromReactChildren(props.children);
	  });
	}
	
	/**
	 * Creates and returns an array of routes created from the given
	 * ReactChildren, all of which should be one of <Route>, <DefaultRoute>,
	 * <NotFoundRoute>, or <Redirect>, e.g.:
	 *
	 *   var { createRoutesFromReactChildren, Route, Redirect } = require('react-router');
	 *
	 *   var routes = createRoutesFromReactChildren(
	 *     <Route path="/" handler={App}>
	 *       <Route name="user" path="/user/:userId" handler={User}>
	 *         <Route name="task" path="tasks/:taskId" handler={Task}/>
	 *         <Redirect from="todos/:taskId" to="task"/>
	 *       </Route>
	 *     </Route>
	 *   );
	 */
	function createRoutesFromReactChildren(children) {
	  var routes = [];
	
	  React.Children.forEach(children, function (child) {
	    if (child = createRouteFromReactElement(child)) routes.push(child);
	  });
	
	  return routes;
	}
	
	module.exports = createRoutesFromReactChildren;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/* jshint -W058 */
	var React = __webpack_require__(2);
	var warning = __webpack_require__(66);
	var invariant = __webpack_require__(65);
	var canUseDOM = __webpack_require__(67).canUseDOM;
	var LocationActions = __webpack_require__(54);
	var ImitateBrowserBehavior = __webpack_require__(33);
	var HashLocation = __webpack_require__(28);
	var HistoryLocation = __webpack_require__(29);
	var RefreshLocation = __webpack_require__(30);
	var StaticLocation = __webpack_require__(31);
	var ScrollHistory = __webpack_require__(56);
	var createRoutesFromReactChildren = __webpack_require__(39);
	var isReactChildren = __webpack_require__(57);
	var Transition = __webpack_require__(58);
	var PropTypes = __webpack_require__(51);
	var Redirect = __webpack_require__(59);
	var History = __webpack_require__(35);
	var Cancellation = __webpack_require__(60);
	var Match = __webpack_require__(61);
	var Route = __webpack_require__(38);
	var supportsHistory = __webpack_require__(62);
	var PathUtils = __webpack_require__(55);
	
	/**
	 * The default location for new routers.
	 */
	var DEFAULT_LOCATION = canUseDOM ? HashLocation : "/";
	
	/**
	 * The default scroll behavior for new routers.
	 */
	var DEFAULT_SCROLL_BEHAVIOR = canUseDOM ? ImitateBrowserBehavior : null;
	
	function hasProperties(object, properties) {
	  for (var propertyName in properties) if (properties.hasOwnProperty(propertyName) && object[propertyName] !== properties[propertyName]) {
	    return false;
	  }return true;
	}
	
	function hasMatch(routes, route, prevParams, nextParams, prevQuery, nextQuery) {
	  return routes.some(function (r) {
	    if (r !== route) return false;
	
	    var paramNames = route.paramNames;
	    var paramName;
	
	    // Ensure that all params the route cares about did not change.
	    for (var i = 0, len = paramNames.length; i < len; ++i) {
	      paramName = paramNames[i];
	
	      if (nextParams[paramName] !== prevParams[paramName]) return false;
	    }
	
	    // Ensure the query hasn't changed.
	    return hasProperties(prevQuery, nextQuery) && hasProperties(nextQuery, prevQuery);
	  });
	}
	
	function addRoutesToNamedRoutes(routes, namedRoutes) {
	  var route;
	  for (var i = 0, len = routes.length; i < len; ++i) {
	    route = routes[i];
	
	    if (route.name) {
	      invariant(namedRoutes[route.name] == null, "You may not have more than one route named \"%s\"", route.name);
	
	      namedRoutes[route.name] = route;
	    }
	
	    if (route.childRoutes) addRoutesToNamedRoutes(route.childRoutes, namedRoutes);
	  }
	}
	
	function routeIsActive(activeRoutes, routeName) {
	  return activeRoutes.some(function (route) {
	    return route.name === routeName;
	  });
	}
	
	function paramsAreActive(activeParams, params) {
	  for (var property in params) if (String(activeParams[property]) !== String(params[property])) {
	    return false;
	  }return true;
	}
	
	function queryIsActive(activeQuery, query) {
	  for (var property in query) if (String(activeQuery[property]) !== String(query[property])) {
	    return false;
	  }return true;
	}
	
	/**
	 * Creates and returns a new router using the given options. A router
	 * is a ReactComponent class that knows how to react to changes in the
	 * URL and keep the contents of the page in sync.
	 *
	 * Options may be any of the following:
	 *
	 * - routes           (required) The route config
	 * - location         The location to use. Defaults to HashLocation when
	 *                    the DOM is available, "/" otherwise
	 * - scrollBehavior   The scroll behavior to use. Defaults to ImitateBrowserBehavior
	 *                    when the DOM is available, null otherwise
	 * - onError          A function that is used to handle errors
	 * - onAbort          A function that is used to handle aborted transitions
	 *
	 * When rendering in a server-side environment, the location should simply
	 * be the URL path that was used in the request, including the query string.
	 */
	function createRouter(options) {
	  options = options || {};
	
	  if (isReactChildren(options)) options = { routes: options };
	
	  var mountedComponents = [];
	  var location = options.location || DEFAULT_LOCATION;
	  var scrollBehavior = options.scrollBehavior || DEFAULT_SCROLL_BEHAVIOR;
	  var state = {};
	  var nextState = {};
	  var pendingTransition = null;
	  var dispatchHandler = null;
	
	  if (typeof location === "string") location = new StaticLocation(location);
	
	  if (location instanceof StaticLocation) {
	    warning(!canUseDOM || ("development") === "test", "You should not use a static location in a DOM environment because " + "the router will not be kept in sync with the current URL");
	  } else {
	    invariant(canUseDOM || location.needsDOM === false, "You cannot use %s without a DOM", location);
	  }
	
	  // Automatically fall back to full page refreshes in
	  // browsers that don't support the HTML history API.
	  if (location === HistoryLocation && !supportsHistory()) location = RefreshLocation;
	
	  var Router = React.createClass({
	
	    displayName: "Router",
	
	    statics: {
	
	      isRunning: false,
	
	      cancelPendingTransition: function cancelPendingTransition() {
	        if (pendingTransition) {
	          pendingTransition.cancel();
	          pendingTransition = null;
	        }
	      },
	
	      clearAllRoutes: function clearAllRoutes() {
	        Router.cancelPendingTransition();
	        Router.namedRoutes = {};
	        Router.routes = [];
	      },
	
	      /**
	       * Adds routes to this router from the given children object (see ReactChildren).
	       */
	      addRoutes: function addRoutes(routes) {
	        if (isReactChildren(routes)) routes = createRoutesFromReactChildren(routes);
	
	        addRoutesToNamedRoutes(routes, Router.namedRoutes);
	
	        Router.routes.push.apply(Router.routes, routes);
	      },
	
	      /**
	       * Replaces routes of this router from the given children object (see ReactChildren).
	       */
	      replaceRoutes: function replaceRoutes(routes) {
	        Router.clearAllRoutes();
	        Router.addRoutes(routes);
	        Router.refresh();
	      },
	
	      /**
	       * Performs a match of the given path against this router and returns an object
	       * with the { routes, params, pathname, query } that match. Returns null if no
	       * match can be made.
	       */
	      match: function match(path) {
	        return Match.findMatch(Router.routes, path);
	      },
	
	      /**
	       * Returns an absolute URL path created from the given route
	       * name, URL parameters, and query.
	       */
	      makePath: function makePath(to, params, query) {
	        var path;
	        if (PathUtils.isAbsolute(to)) {
	          path = to;
	        } else {
	          var route = to instanceof Route ? to : Router.namedRoutes[to];
	
	          invariant(route instanceof Route, "Cannot find a route named \"%s\"", to);
	
	          path = route.path;
	        }
	
	        return PathUtils.withQuery(PathUtils.injectParams(path, params), query);
	      },
	
	      /**
	       * Returns a string that may safely be used as the href of a link
	       * to the route with the given name, URL parameters, and query.
	       */
	      makeHref: function makeHref(to, params, query) {
	        var path = Router.makePath(to, params, query);
	        return location === HashLocation ? "#" + path : path;
	      },
	
	      /**
	       * Transitions to the URL specified in the arguments by pushing
	       * a new URL onto the history stack.
	       */
	      transitionTo: function transitionTo(to, params, query) {
	        var path = Router.makePath(to, params, query);
	
	        if (pendingTransition) {
	          // Replace so pending location does not stay in history.
	          location.replace(path);
	        } else {
	          location.push(path);
	        }
	      },
	
	      /**
	       * Transitions to the URL specified in the arguments by replacing
	       * the current URL in the history stack.
	       */
	      replaceWith: function replaceWith(to, params, query) {
	        location.replace(Router.makePath(to, params, query));
	      },
	
	      /**
	       * Transitions to the previous URL if one is available. Returns true if the
	       * router was able to go back, false otherwise.
	       *
	       * Note: The router only tracks history entries in your application, not the
	       * current browser session, so you can safely call this function without guarding
	       * against sending the user back to some other site. However, when using
	       * RefreshLocation (which is the fallback for HistoryLocation in browsers that
	       * don't support HTML5 history) this method will *always* send the client back
	       * because we cannot reliably track history length.
	       */
	      goBack: function goBack() {
	        if (History.length > 1 || location === RefreshLocation) {
	          location.pop();
	          return true;
	        }
	
	        warning(false, "goBack() was ignored because there is no router history");
	
	        return false;
	      },
	
	      handleAbort: options.onAbort || function (abortReason) {
	        if (location instanceof StaticLocation) throw new Error("Unhandled aborted transition! Reason: " + abortReason);
	
	        if (abortReason instanceof Cancellation) {
	          return;
	        } else if (abortReason instanceof Redirect) {
	          location.replace(Router.makePath(abortReason.to, abortReason.params, abortReason.query));
	        } else {
	          location.pop();
	        }
	      },
	
	      handleError: options.onError || function (error) {
	        // Throw so we don't silently swallow async errors.
	        throw error; // This error probably originated in a transition hook.
	      },
	
	      handleLocationChange: function handleLocationChange(change) {
	        Router.dispatch(change.path, change.type);
	      },
	
	      /**
	       * Performs a transition to the given path and calls callback(error, abortReason)
	       * when the transition is finished. If both arguments are null the router's state
	       * was updated. Otherwise the transition did not complete.
	       *
	       * In a transition, a router first determines which routes are involved by beginning
	       * with the current route, up the route tree to the first parent route that is shared
	       * with the destination route, and back down the tree to the destination route. The
	       * willTransitionFrom hook is invoked on all route handlers we're transitioning away
	       * from, in reverse nesting order. Likewise, the willTransitionTo hook is invoked on
	       * all route handlers we're transitioning to.
	       *
	       * Both willTransitionFrom and willTransitionTo hooks may either abort or redirect the
	       * transition. To resolve asynchronously, they may use the callback argument. If no
	       * hooks wait, the transition is fully synchronous.
	       */
	      dispatch: function dispatch(path, action) {
	        Router.cancelPendingTransition();
	
	        var prevPath = state.path;
	        var isRefreshing = action == null;
	
	        if (prevPath === path && !isRefreshing) {
	          return;
	        } // Nothing to do!
	
	        // Record the scroll position as early as possible to
	        // get it before browsers try update it automatically.
	        if (prevPath && action === LocationActions.PUSH) Router.recordScrollPosition(prevPath);
	
	        var match = Router.match(path);
	
	        warning(match != null, "No route matches path \"%s\". Make sure you have <Route path=\"%s\"> somewhere in your routes", path, path);
	
	        if (match == null) match = {};
	
	        var prevRoutes = state.routes || [];
	        var prevParams = state.params || {};
	        var prevQuery = state.query || {};
	
	        var nextRoutes = match.routes || [];
	        var nextParams = match.params || {};
	        var nextQuery = match.query || {};
	
	        var fromRoutes, toRoutes;
	        if (prevRoutes.length) {
	          fromRoutes = prevRoutes.filter(function (route) {
	            return !hasMatch(nextRoutes, route, prevParams, nextParams, prevQuery, nextQuery);
	          });
	
	          toRoutes = nextRoutes.filter(function (route) {
	            return !hasMatch(prevRoutes, route, prevParams, nextParams, prevQuery, nextQuery);
	          });
	        } else {
	          fromRoutes = [];
	          toRoutes = nextRoutes;
	        }
	
	        var transition = new Transition(path, Router.replaceWith.bind(Router, path));
	        pendingTransition = transition;
	
	        var fromComponents = mountedComponents.slice(prevRoutes.length - fromRoutes.length);
	
	        Transition.from(transition, fromRoutes, fromComponents, function (error) {
	          if (error || transition.abortReason) return dispatchHandler.call(Router, error, transition); // No need to continue.
	
	          Transition.to(transition, toRoutes, nextParams, nextQuery, function (error) {
	            dispatchHandler.call(Router, error, transition, {
	              path: path,
	              action: action,
	              pathname: match.pathname,
	              routes: nextRoutes,
	              params: nextParams,
	              query: nextQuery
	            });
	          });
	        });
	      },
	
	      /**
	       * Starts this router and calls callback(router, state) when the route changes.
	       *
	       * If the router's location is static (i.e. a URL path in a server environment)
	       * the callback is called only once. Otherwise, the location should be one of the
	       * Router.*Location objects (e.g. Router.HashLocation or Router.HistoryLocation).
	       */
	      run: function run(callback) {
	        invariant(!Router.isRunning, "Router is already running");
	
	        dispatchHandler = function (error, transition, newState) {
	          if (error) Router.handleError(error);
	
	          if (pendingTransition !== transition) return;
	
	          pendingTransition = null;
	
	          if (transition.abortReason) {
	            Router.handleAbort(transition.abortReason);
	          } else {
	            callback.call(Router, Router, nextState = newState);
	          }
	        };
	
	        if (!(location instanceof StaticLocation)) {
	          if (location.addChangeListener) location.addChangeListener(Router.handleLocationChange);
	
	          Router.isRunning = true;
	        }
	
	        // Bootstrap using the current path.
	        Router.refresh();
	      },
	
	      refresh: function refresh() {
	        Router.dispatch(location.getCurrentPath(), null);
	      },
	
	      stop: function stop() {
	        Router.cancelPendingTransition();
	
	        if (location.removeChangeListener) location.removeChangeListener(Router.handleLocationChange);
	
	        Router.isRunning = false;
	      },
	
	      getLocation: function getLocation() {
	        return location;
	      },
	
	      getScrollBehavior: function getScrollBehavior() {
	        return scrollBehavior;
	      },
	
	      getRouteAtDepth: function getRouteAtDepth(routeDepth) {
	        var routes = state.routes;
	        return routes && routes[routeDepth];
	      },
	
	      setRouteComponentAtDepth: function setRouteComponentAtDepth(routeDepth, component) {
	        mountedComponents[routeDepth] = component;
	      },
	
	      /**
	       * Returns the current URL path + query string.
	       */
	      getCurrentPath: function getCurrentPath() {
	        return state.path;
	      },
	
	      /**
	       * Returns the current URL path without the query string.
	       */
	      getCurrentPathname: function getCurrentPathname() {
	        return state.pathname;
	      },
	
	      /**
	       * Returns an object of the currently active URL parameters.
	       */
	      getCurrentParams: function getCurrentParams() {
	        return state.params;
	      },
	
	      /**
	       * Returns an object of the currently active query parameters.
	       */
	      getCurrentQuery: function getCurrentQuery() {
	        return state.query;
	      },
	
	      /**
	       * Returns an array of the currently active routes.
	       */
	      getCurrentRoutes: function getCurrentRoutes() {
	        return state.routes;
	      },
	
	      /**
	       * Returns true if the given route, params, and query are active.
	       */
	      isActive: function isActive(to, params, query) {
	        if (PathUtils.isAbsolute(to)) {
	          return to === state.path;
	        }return routeIsActive(state.routes, to) && paramsAreActive(state.params, params) && (query == null || queryIsActive(state.query, query));
	      }
	
	    },
	
	    mixins: [ScrollHistory],
	
	    propTypes: {
	      children: PropTypes.falsy
	    },
	
	    childContextTypes: {
	      routeDepth: PropTypes.number.isRequired,
	      router: PropTypes.router.isRequired
	    },
	
	    getChildContext: function getChildContext() {
	      return {
	        routeDepth: 1,
	        router: Router
	      };
	    },
	
	    getInitialState: function getInitialState() {
	      return state = nextState;
	    },
	
	    componentWillReceiveProps: function componentWillReceiveProps() {
	      this.setState(state = nextState);
	    },
	
	    componentWillUnmount: function componentWillUnmount() {
	      Router.stop();
	    },
	
	    render: function render() {
	      var route = Router.getRouteAtDepth(0);
	      return route ? React.createElement(route.handler, this.props) : null;
	    }
	
	  });
	
	  Router.clearAllRoutes();
	
	  if (options.routes) Router.addRoutes(options.routes);
	
	  return Router;
	}
	
	module.exports = createRouter;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var createRouter = __webpack_require__(40);
	
	/**
	 * A high-level convenience method that creates, configures, and
	 * runs a router in one shot. The method signature is:
	 *
	 *   Router.run(routes[, location ], callback);
	 *
	 * Using `window.location.hash` to manage the URL, you could do:
	 *
	 *   Router.run(routes, function (Handler) {
	 *     React.render(<Handler/>, document.body);
	 *   });
	 * 
	 * Using HTML5 history and a custom "cursor" prop:
	 * 
	 *   Router.run(routes, Router.HistoryLocation, function (Handler) {
	 *     React.render(<Handler cursor={cursor}/>, document.body);
	 *   });
	 *
	 * Returns the newly created router.
	 *
	 * Note: If you need to specify further options for your router such
	 * as error/abort handling or custom scroll behavior, use Router.create
	 * instead.
	 *
	 *   var router = Router.create(options);
	 *   router.run(function (Handler) {
	 *     // ...
	 *   });
	 */
	function runRouter(routes, location, callback) {
	  if (typeof location === "function") {
	    callback = location;
	    location = null;
	  }
	
	  var router = createRouter({
	    routes: routes,
	    location: location
	  });
	
	  router.run(callback);
	
	  return router;
	}
	
	module.exports = runRouter;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$create = __webpack_require__(50)["default"];
	
	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }
	
	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) subClass.__proto__ = superClass;
	};
	
	exports.__esModule = true;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(16)["default"];
	
	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	
	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();
	
	exports.__esModule = true;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$assign = __webpack_require__(68)["default"];
	
	exports["default"] = _Object$assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};
	
	exports.__esModule = true;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$getOwnPropertyDescriptor = __webpack_require__(69)["default"];
	
	exports["default"] = function get(_x, _x2, _x3) {
	  var _again = true;
	
	  _function: while (_again) {
	    desc = parent = getter = undefined;
	    _again = false;
	    var object = _x,
	        property = _x2,
	        receiver = _x3;
	
	    var desc = _Object$getOwnPropertyDescriptor(object, property);
	
	    if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);
	
	      if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;
	        _x2 = property;
	        _x3 = receiver;
	        _again = true;
	        continue _function;
	      }
	    } else if ("value" in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;
	
	      if (getter === undefined) {
	        return undefined;
	      }
	
	      return getter.call(receiver);
	    }
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(63), __esModule: true };

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(70);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	(function(exports) {
	  exports.noop = function(){};
	})(typeof module === 'object' && typeof module.exports === 'object' ? module.exports : window);


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(71), __esModule: true };

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var assign = __webpack_require__(64);
	var ReactPropTypes = __webpack_require__(2).PropTypes;
	var Route = __webpack_require__(38);
	
	var PropTypes = assign({}, ReactPropTypes, {
	
	  /**
	   * Indicates that a prop should be falsy.
	   */
	  falsy: function falsy(props, propName, componentName) {
	    if (props[propName]) {
	      return new Error("<" + componentName + "> may not have a \"" + propName + "\" prop");
	    }
	  },
	
	  /**
	   * Indicates that a prop should be a Route object.
	   */
	  route: ReactPropTypes.instanceOf(Route),
	
	  /**
	   * Indicates that a prop should be a Router object.
	   */
	  //router: ReactPropTypes.instanceOf(Router) // TODO
	  router: ReactPropTypes.func
	
	});
	
	module.exports = PropTypes;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(72), __esModule: true };

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperties = __webpack_require__(52)["default"];
	
	var _Object$create = __webpack_require__(50)["default"];
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var key in props) {
	      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
	    }_Object$defineProperties(target, props);
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _inherits = function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }subClass.prototype = _Object$create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) subClass.__proto__ = superClass;
	};
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	/**
	 * This component is necessary to get around a context warning
	 * present in React 0.13.0. It sovles this by providing a separation
	 * between the "owner" and "parent" contexts.
	 */
	
	var React = __webpack_require__(2);
	
	var ContextWrapper = (function (_React$Component) {
	  function ContextWrapper() {
	    _classCallCheck(this, ContextWrapper);
	
	    if (_React$Component != null) {
	      _React$Component.apply(this, arguments);
	    }
	  }
	
	  _inherits(ContextWrapper, _React$Component);
	
	  _createClass(ContextWrapper, {
	    render: {
	      value: function render() {
	        return this.props.children;
	      }
	    }
	  });
	
	  return ContextWrapper;
	})(React.Component);
	
	module.exports = ContextWrapper;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * Actions that modify the URL.
	 */
	var LocationActions = {
	
	  /**
	   * Indicates a new location is being pushed to the history stack.
	   */
	  PUSH: "push",
	
	  /**
	   * Indicates the current location should be replaced.
	   */
	  REPLACE: "replace",
	
	  /**
	   * Indicates the most recent entry should be removed from the history stack.
	   */
	  POP: "pop"
	
	};
	
	module.exports = LocationActions;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var invariant = __webpack_require__(65);
	var objectAssign = __webpack_require__(79);
	var qs = __webpack_require__(80);
	
	var paramCompileMatcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|[*.()\[\]\\+|{}^$]/g;
	var paramInjectMatcher = /:([a-zA-Z_$][a-zA-Z0-9_$?]*[?]?)|[*]/g;
	var paramInjectTrailingSlashMatcher = /\/\/\?|\/\?\/|\/\?/g;
	var queryMatcher = /\?(.*)$/;
	
	var _compiledPatterns = {};
	
	function compilePattern(pattern) {
	  if (!(pattern in _compiledPatterns)) {
	    var paramNames = [];
	    var source = pattern.replace(paramCompileMatcher, function (match, paramName) {
	      if (paramName) {
	        paramNames.push(paramName);
	        return "([^/?#]+)";
	      } else if (match === "*") {
	        paramNames.push("splat");
	        return "(.*?)";
	      } else {
	        return "\\" + match;
	      }
	    });
	
	    _compiledPatterns[pattern] = {
	      matcher: new RegExp("^" + source + "$", "i"),
	      paramNames: paramNames
	    };
	  }
	
	  return _compiledPatterns[pattern];
	}
	
	var PathUtils = {
	
	  /**
	   * Returns true if the given path is absolute.
	   */
	  isAbsolute: function isAbsolute(path) {
	    return path.charAt(0) === "/";
	  },
	
	  /**
	   * Joins two URL paths together.
	   */
	  join: function join(a, b) {
	    return a.replace(/\/*$/, "/") + b;
	  },
	
	  /**
	   * Returns an array of the names of all parameters in the given pattern.
	   */
	  extractParamNames: function extractParamNames(pattern) {
	    return compilePattern(pattern).paramNames;
	  },
	
	  /**
	   * Extracts the portions of the given URL path that match the given pattern
	   * and returns an object of param name => value pairs. Returns null if the
	   * pattern does not match the given path.
	   */
	  extractParams: function extractParams(pattern, path) {
	    var _compilePattern = compilePattern(pattern);
	
	    var matcher = _compilePattern.matcher;
	    var paramNames = _compilePattern.paramNames;
	
	    var match = path.match(matcher);
	
	    if (!match) {
	      return null;
	    }var params = {};
	
	    paramNames.forEach(function (paramName, index) {
	      params[paramName] = match[index + 1];
	    });
	
	    return params;
	  },
	
	  /**
	   * Returns a version of the given route path with params interpolated. Throws
	   * if there is a dynamic segment of the route path for which there is no param.
	   */
	  injectParams: function injectParams(pattern, params) {
	    params = params || {};
	
	    var splatIndex = 0;
	
	    return pattern.replace(paramInjectMatcher, function (match, paramName) {
	      paramName = paramName || "splat";
	
	      // If param is optional don't check for existence
	      if (paramName.slice(-1) === "?") {
	        paramName = paramName.slice(0, -1);
	
	        if (params[paramName] == null) return "";
	      } else {
	        invariant(params[paramName] != null, "Missing \"%s\" parameter for path \"%s\"", paramName, pattern);
	      }
	
	      var segment;
	      if (paramName === "splat" && Array.isArray(params[paramName])) {
	        segment = params[paramName][splatIndex++];
	
	        invariant(segment != null, "Missing splat # %s for path \"%s\"", splatIndex, pattern);
	      } else {
	        segment = params[paramName];
	      }
	
	      return segment;
	    }).replace(paramInjectTrailingSlashMatcher, "/");
	  },
	
	  /**
	   * Returns an object that is the result of parsing any query string contained
	   * in the given path, null if the path contains no query string.
	   */
	  extractQuery: function extractQuery(path) {
	    var match = path.match(queryMatcher);
	    return match && qs.parse(match[1]);
	  },
	
	  /**
	   * Returns a version of the given path without the query string.
	   */
	  withoutQuery: function withoutQuery(path) {
	    return path.replace(queryMatcher, "");
	  },
	
	  /**
	   * Returns a version of the given path with the parameters in the given
	   * query merged into the query string.
	   */
	  withQuery: function withQuery(path, query) {
	    var existingQuery = PathUtils.extractQuery(path);
	
	    if (existingQuery) query = query ? objectAssign(existingQuery, query) : existingQuery;
	
	    var queryString = qs.stringify(query, { arrayFormat: "brackets" });
	
	    if (queryString) {
	      return PathUtils.withoutQuery(path) + "?" + queryString;
	    }return PathUtils.withoutQuery(path);
	  }
	
	};
	
	module.exports = PathUtils;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var invariant = __webpack_require__(65);
	var canUseDOM = __webpack_require__(67).canUseDOM;
	var getWindowScrollPosition = __webpack_require__(73);
	
	function shouldUpdateScroll(state, prevState) {
	  if (!prevState) {
	    return true;
	  } // Don't update scroll position when only the query has changed.
	  if (state.pathname === prevState.pathname) {
	    return false;
	  }var routes = state.routes;
	  var prevRoutes = prevState.routes;
	
	  var sharedAncestorRoutes = routes.filter(function (route) {
	    return prevRoutes.indexOf(route) !== -1;
	  });
	
	  return !sharedAncestorRoutes.some(function (route) {
	    return route.ignoreScrollBehavior;
	  });
	}
	
	/**
	 * Provides the router with the ability to manage window scroll position
	 * according to its scroll behavior.
	 */
	var ScrollHistory = {
	
	  statics: {
	
	    /**
	     * Records curent scroll position as the last known position for the given URL path.
	     */
	    recordScrollPosition: function recordScrollPosition(path) {
	      if (!this.scrollHistory) this.scrollHistory = {};
	
	      this.scrollHistory[path] = getWindowScrollPosition();
	    },
	
	    /**
	     * Returns the last known scroll position for the given URL path.
	     */
	    getScrollPosition: function getScrollPosition(path) {
	      if (!this.scrollHistory) this.scrollHistory = {};
	
	      return this.scrollHistory[path] || null;
	    }
	
	  },
	
	  componentWillMount: function componentWillMount() {
	    invariant(this.constructor.getScrollBehavior() == null || canUseDOM, "Cannot use scroll behavior without a DOM");
	  },
	
	  componentDidMount: function componentDidMount() {
	    this._updateScroll();
	  },
	
	  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	    this._updateScroll(prevState);
	  },
	
	  _updateScroll: function _updateScroll(prevState) {
	    if (!shouldUpdateScroll(this.state, prevState)) {
	      return;
	    }var scrollBehavior = this.constructor.getScrollBehavior();
	
	    if (scrollBehavior) scrollBehavior.updateScrollPosition(this.constructor.getScrollPosition(this.state.path), this.state.action);
	  }
	
	};
	
	module.exports = ScrollHistory;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var React = __webpack_require__(2);
	
	function isValidChild(object) {
	  return object == null || React.isValidElement(object);
	}
	
	function isReactChildren(object) {
	  return isValidChild(object) || Array.isArray(object) && object.every(isValidChild);
	}
	
	module.exports = isReactChildren;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/* jshint -W058 */
	
	var Cancellation = __webpack_require__(60);
	var Redirect = __webpack_require__(59);
	
	/**
	 * Encapsulates a transition to a given path.
	 *
	 * The willTransitionTo and willTransitionFrom handlers receive
	 * an instance of this class as their first argument.
	 */
	function Transition(path, retry) {
	  this.path = path;
	  this.abortReason = null;
	  // TODO: Change this to router.retryTransition(transition)
	  this.retry = retry.bind(this);
	}
	
	Transition.prototype.abort = function (reason) {
	  if (this.abortReason == null) this.abortReason = reason || "ABORT";
	};
	
	Transition.prototype.redirect = function (to, params, query) {
	  this.abort(new Redirect(to, params, query));
	};
	
	Transition.prototype.cancel = function () {
	  this.abort(new Cancellation());
	};
	
	Transition.from = function (transition, routes, components, callback) {
	  routes.reduce(function (callback, route, index) {
	    return function (error) {
	      if (error || transition.abortReason) {
	        callback(error);
	      } else if (route.onLeave) {
	        try {
	          route.onLeave(transition, components[index], callback);
	
	          // If there is no callback in the argument list, call it automatically.
	          if (route.onLeave.length < 3) callback();
	        } catch (e) {
	          callback(e);
	        }
	      } else {
	        callback();
	      }
	    };
	  }, callback)();
	};
	
	Transition.to = function (transition, routes, params, query, callback) {
	  routes.reduceRight(function (callback, route) {
	    return function (error) {
	      if (error || transition.abortReason) {
	        callback(error);
	      } else if (route.onEnter) {
	        try {
	          route.onEnter(transition, params, query, callback);
	
	          // If there is no callback in the argument list, call it automatically.
	          if (route.onEnter.length < 4) callback();
	        } catch (e) {
	          callback(e);
	        }
	      } else {
	        callback();
	      }
	    };
	  }, callback)();
	};
	
	module.exports = Transition;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * Encapsulates a redirect to the given route.
	 */
	function Redirect(to, params, query) {
	  this.to = to;
	  this.params = params;
	  this.query = query;
	}
	
	module.exports = Redirect;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * Represents a cancellation caused by navigating away
	 * before the previous transition has fully resolved.
	 */
	function Cancellation() {}
	
	module.exports = Cancellation;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperties = __webpack_require__(52)["default"];
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var key in props) {
	      var prop = props[key];prop.configurable = true;if (prop.value) prop.writable = true;
	    }_Object$defineProperties(target, props);
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	var _classCallCheck = function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	/* jshint -W084 */
	var PathUtils = __webpack_require__(55);
	
	function deepSearch(route, pathname, query) {
	  // Check the subtree first to find the most deeply-nested match.
	  var childRoutes = route.childRoutes;
	  if (childRoutes) {
	    var match, childRoute;
	    for (var i = 0, len = childRoutes.length; i < len; ++i) {
	      childRoute = childRoutes[i];
	
	      if (childRoute.isDefault || childRoute.isNotFound) continue; // Check these in order later.
	
	      if (match = deepSearch(childRoute, pathname, query)) {
	        // A route in the subtree matched! Add this route and we're done.
	        match.routes.unshift(route);
	        return match;
	      }
	    }
	  }
	
	  // No child routes matched; try the default route.
	  var defaultRoute = route.defaultRoute;
	  if (defaultRoute && (params = PathUtils.extractParams(defaultRoute.path, pathname))) {
	    return new Match(pathname, params, query, [route, defaultRoute]);
	  } // Does the "not found" route match?
	  var notFoundRoute = route.notFoundRoute;
	  if (notFoundRoute && (params = PathUtils.extractParams(notFoundRoute.path, pathname))) {
	    return new Match(pathname, params, query, [route, notFoundRoute]);
	  } // Last attempt: check this route.
	  var params = PathUtils.extractParams(route.path, pathname);
	  if (params) {
	    return new Match(pathname, params, query, [route]);
	  }return null;
	}
	
	var Match = (function () {
	  function Match(pathname, params, query, routes) {
	    _classCallCheck(this, Match);
	
	    this.pathname = pathname;
	    this.params = params;
	    this.query = query;
	    this.routes = routes;
	  }
	
	  _createClass(Match, null, {
	    findMatch: {
	
	      /**
	       * Attempts to match depth-first a route in the given route's
	       * subtree against the given path and returns the match if it
	       * succeeds, null if no match can be made.
	       */
	
	      value: function findMatch(routes, path) {
	        var pathname = PathUtils.withoutQuery(path);
	        var query = PathUtils.extractQuery(path);
	        var match = null;
	
	        for (var i = 0, len = routes.length; match == null && i < len; ++i) match = deepSearch(routes[i], pathname, query);
	
	        return match;
	      }
	    }
	  });
	
	  return Match;
	})();
	
	module.exports = Match;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function supportsHistory() {
	  /*! taken from modernizr
	   * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
	   * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
	   * changed to avoid false negatives for Windows Phones: https://github.com/rackt/react-router/issues/586
	   */
	  var ua = navigator.userAgent;
	  if ((ua.indexOf("Android 2.") !== -1 || ua.indexOf("Android 4.0") !== -1) && ua.indexOf("Mobile Safari") !== -1 && ua.indexOf("Chrome") === -1 && ua.indexOf("Windows Phone") === -1) {
	    return false;
	  }
	  return window.history && "pushState" in window.history;
	}
	
	module.exports = supportsHistory;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(75);
	module.exports = __webpack_require__(70).core.Object.keys;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Object.assign
	 */
	
	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign
	
	'use strict';
	
	function assign(target, sources) {
	  if (target == null) {
	    throw new TypeError('Object.assign target cannot be null or undefined');
	  }
	
	  var to = Object(target);
	  var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
	    var nextSource = arguments[nextIndex];
	    if (nextSource == null) {
	      continue;
	    }
	
	    var from = Object(nextSource);
	
	    // We don't currently support accessors nor proxies. Therefore this
	    // copy cannot throw. If we ever supported this then we must handle
	    // exceptions and side-effects. We don't support symbols so they won't
	    // be transferred.
	
	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	  }
	
	  return to;
	}
	
	module.exports = assign;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */
	
	"use strict";
	
	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */
	
	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (true) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }
	
	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }
	
	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};
	
	module.exports = invariant;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule warning
	 */
	
	"use strict";
	
	var emptyFunction = __webpack_require__(74);
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warning = emptyFunction;
	
	if (true) {
	  warning = function(condition, format ) {for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }
	
	    if (format.length < 10 || /^[s\W]*$/.test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }
	
	    if (format.indexOf('Failed Composite propType: ') === 0) {
	      return; // Ignore CompositeComponent proptype check.
	    }
	
	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];});
	      console.warn(message);
	      try {
	        // --- Welcome to debugging React ---
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}
	
	module.exports = warning;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule ExecutionEnvironment
	 */
	
	/*jslint evil: true */
	
	"use strict";
	
	var canUseDOM = !!(
	  (typeof window !== 'undefined' &&
	  window.document && window.document.createElement)
	);
	
	/**
	 * Simple, lightweight module assisting with the detection and context of
	 * Worker. Helps avoid circular dependencies and allows code to reason about
	 * whether or not they are in a Worker, even if they never include the main
	 * `ReactWorker` dependency.
	 */
	var ExecutionEnvironment = {
	
	  canUseDOM: canUseDOM,
	
	  canUseWorkers: typeof Worker !== 'undefined',
	
	  canUseEventListeners:
	    canUseDOM && !!(window.addEventListener || window.attachEvent),
	
	  canUseViewport: canUseDOM && !!window.screen,
	
	  isInWorker: !canUseDOM // For now, this is true - might change in the future.
	
	};
	
	module.exports = ExecutionEnvironment;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(76), __esModule: true };

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global = typeof self != 'undefined' ? self : Function('return this')()
	  , core   = {}
	  , defineProperty = Object.defineProperty
	  , hasOwnProperty = {}.hasOwnProperty
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , max   = Math.max
	  , min   = Math.min;
	// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
	var DESC = !!function(){
	  try {
	    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
	  } catch(e){ /* empty */ }
	}();
	var hide = createDefiner(1);
	// 7.1.4 ToInteger
	function toInteger(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	}
	function desc(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	}
	function simpleSet(object, key, value){
	  object[key] = value;
	  return object;
	}
	function createDefiner(bitmap){
	  return DESC ? function(object, key, value){
	    return $.setDesc(object, key, desc(bitmap, value));
	  } : simpleSet;
	}
	
	function isObject(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	}
	function isFunction(it){
	  return typeof it == 'function';
	}
	function assertDefined(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	}
	
	var $ = module.exports = __webpack_require__(78)({
	  g: global,
	  core: core,
	  html: global.document && document.documentElement,
	  // http://jsperf.com/core-js-isobject
	  isObject:   isObject,
	  isFunction: isFunction,
	  it: function(it){
	    return it;
	  },
	  that: function(){
	    return this;
	  },
	  // 7.1.4 ToInteger
	  toInteger: toInteger,
	  // 7.1.15 ToLength
	  toLength: function(it){
	    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	  },
	  toIndex: function(index, length){
	    index = toInteger(index);
	    return index < 0 ? max(index + length, 0) : min(index, length);
	  },
	  has: function(it, key){
	    return hasOwnProperty.call(it, key);
	  },
	  create:     Object.create,
	  getProto:   Object.getPrototypeOf,
	  DESC:       DESC,
	  desc:       desc,
	  getDesc:    Object.getOwnPropertyDescriptor,
	  setDesc:    defineProperty,
	  setDescs:   Object.defineProperties,
	  getKeys:    Object.keys,
	  getNames:   Object.getOwnPropertyNames,
	  getSymbols: Object.getOwnPropertySymbols,
	  assertDefined: assertDefined,
	  // Dummy, fix for not array-like ES3 string in es5 module
	  ES5Object: Object,
	  toObject: function(it){
	    return $.ES5Object(assertDefined(it));
	  },
	  hide: hide,
	  def: createDefiner(0),
	  set: global.Symbol ? simpleSet : hide,
	  mix: function(target, src){
	    for(var key in src)hide(target, key, src[key]);
	    return target;
	  },
	  each: [].forEach
	});
	/* eslint-disable no-undef */
	if(typeof __e != 'undefined')__e = core;
	if(typeof __g != 'undefined')__g = global;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(70);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(70);
	module.exports = function defineProperties(T, D){
	  return $.setDescs(T, D);
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var invariant = __webpack_require__(65);
	var canUseDOM = __webpack_require__(67).canUseDOM;
	
	/**
	 * Returns the current scroll position of the window as { x, y }.
	 */
	function getWindowScrollPosition() {
	  invariant(canUseDOM, "Cannot get current scroll position without a DOM");
	
	  return {
	    x: window.pageXOffset || document.documentElement.scrollLeft,
	    y: window.pageYOffset || document.documentElement.scrollTop
	  };
	}
	
	module.exports = getWindowScrollPosition;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule emptyFunction
	 */
	
	function makeEmptyFunction(arg) {
	  return function() {
	    return arg;
	  };
	}
	
	/**
	 * This function accepts and discards inputs; it has no side effects. This is
	 * primarily useful idiomatically for overridable function endpoints which
	 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
	 */
	function emptyFunction() {}
	
	emptyFunction.thatReturns = makeEmptyFunction;
	emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
	emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
	emptyFunction.thatReturnsNull = makeEmptyFunction(null);
	emptyFunction.thatReturnsThis = function() { return this; };
	emptyFunction.thatReturnsArgument = function(arg) { return arg; };
	
	module.exports = emptyFunction;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(70)
	  , $def     = __webpack_require__(81)
	  , isObject = $.isObject
	  , toObject = $.toObject;
	function wrapObjectMethod(METHOD, MODE){
	  var fn  = ($.core.Object || {})[METHOD] || Object[METHOD]
	    , f   = 0
	    , o   = {};
	  o[METHOD] = MODE == 1 ? function(it){
	    return isObject(it) ? fn(it) : it;
	  } : MODE == 2 ? function(it){
	    return isObject(it) ? fn(it) : true;
	  } : MODE == 3 ? function(it){
	    return isObject(it) ? fn(it) : false;
	  } : MODE == 4 ? function getOwnPropertyDescriptor(it, key){
	    return fn(toObject(it), key);
	  } : MODE == 5 ? function getPrototypeOf(it){
	    return fn(Object($.assertDefined(it)));
	  } : function(it){
	    return fn(toObject(it));
	  };
	  try {
	    fn('z');
	  } catch(e){
	    f = 1;
	  }
	  $def($def.S + $def.F * f, 'Object', o);
	}
	wrapObjectMethod('freeze', 1);
	wrapObjectMethod('seal', 1);
	wrapObjectMethod('preventExtensions', 1);
	wrapObjectMethod('isFrozen', 2);
	wrapObjectMethod('isSealed', 2);
	wrapObjectMethod('isExtensible', 3);
	wrapObjectMethod('getOwnPropertyDescriptor', 4);
	wrapObjectMethod('getPrototypeOf', 5);
	wrapObjectMethod('keys');
	wrapObjectMethod('getOwnPropertyNames');

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(70);
	__webpack_require__(75);
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $.getDesc(it, key);
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(82);
	module.exports = __webpack_require__(70).core.Object.assign;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function($){
	  $.FW   = false;
	  $.path = $.core;
	  return $;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);
	
		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));
	
			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}
	
		return to;
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(83);


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(70)
	  , global     = $.g
	  , core       = $.core
	  , isFunction = $.isFunction;
	function ctx(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	}
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	function $def(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {}).prototype
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && !isFunction(target[key]))exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp.prototype = C.prototype;
	    }(out);
	    else exp = type & $def.P && isFunction(out) ? ctx(Function.call, out) : out;
	    // export
	    $.hide(exports, key, exp);
	  }
	}
	module.exports = $def;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(81);
	$def($def.S, 'Object', {assign: __webpack_require__(84)});

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// Load modules
	
	var Stringify = __webpack_require__(85);
	var Parse = __webpack_require__(86);
	
	
	// Declare internals
	
	var internals = {};
	
	
	module.exports = {
	    stringify: Stringify,
	    parse: Parse
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(70)
	  , enumKeys = __webpack_require__(87);
	// 19.1.2.1 Object.assign(target, source, ...)
	/* eslint-disable no-unused-vars */
	module.exports = Object.assign || function assign(target, source){
	/* eslint-enable no-unused-vars */
	  var T = Object($.assertDefined(target))
	    , l = arguments.length
	    , i = 1;
	  while(l > i){
	    var S      = $.ES5Object(arguments[i++])
	      , keys   = enumKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)T[key = keys[j++]] = S[key];
	  }
	  return T;
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	// Load modules
	
	var Utils = __webpack_require__(88);
	
	
	// Declare internals
	
	var internals = {
	    delimiter: '&',
	    arrayPrefixGenerators: {
	        brackets: function (prefix, key) {
	            return prefix + '[]';
	        },
	        indices: function (prefix, key) {
	            return prefix + '[' + key + ']';
	        },
	        repeat: function (prefix, key) {
	            return prefix;
	        }
	    }
	};
	
	
	internals.stringify = function (obj, prefix, generateArrayPrefix) {
	
	    if (Utils.isBuffer(obj)) {
	        obj = obj.toString();
	    }
	    else if (obj instanceof Date) {
	        obj = obj.toISOString();
	    }
	    else if (obj === null) {
	        obj = '';
	    }
	
	    if (typeof obj === 'string' ||
	        typeof obj === 'number' ||
	        typeof obj === 'boolean') {
	
	        return [encodeURIComponent(prefix) + '=' + encodeURIComponent(obj)];
	    }
	
	    var values = [];
	
	    if (typeof obj === 'undefined') {
	        return values;
	    }
	
	    var objKeys = Object.keys(obj);
	    for (var i = 0, il = objKeys.length; i < il; ++i) {
	        var key = objKeys[i];
	        if (Array.isArray(obj)) {
	            values = values.concat(internals.stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix));
	        }
	        else {
	            values = values.concat(internals.stringify(obj[key], prefix + '[' + key + ']', generateArrayPrefix));
	        }
	    }
	
	    return values;
	};
	
	
	module.exports = function (obj, options) {
	
	    options = options || {};
	    var delimiter = typeof options.delimiter === 'undefined' ? internals.delimiter : options.delimiter;
	
	    var keys = [];
	
	    if (typeof obj !== 'object' ||
	        obj === null) {
	
	        return '';
	    }
	
	    var arrayFormat;
	    if (options.arrayFormat in internals.arrayPrefixGenerators) {
	        arrayFormat = options.arrayFormat;
	    }
	    else if ('indices' in options) {
	        arrayFormat = options.indices ? 'indices' : 'repeat';
	    }
	    else {
	        arrayFormat = 'indices';
	    }
	
	    var generateArrayPrefix = internals.arrayPrefixGenerators[arrayFormat];
	
	    var objKeys = Object.keys(obj);
	    for (var i = 0, il = objKeys.length; i < il; ++i) {
	        var key = objKeys[i];
	        keys = keys.concat(internals.stringify(obj[key], key, generateArrayPrefix));
	    }
	
	    return keys.join(delimiter);
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	// Load modules
	
	var Utils = __webpack_require__(88);
	
	
	// Declare internals
	
	var internals = {
	    delimiter: '&',
	    depth: 5,
	    arrayLimit: 20,
	    parameterLimit: 1000
	};
	
	
	internals.parseValues = function (str, options) {
	
	    var obj = {};
	    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);
	
	    for (var i = 0, il = parts.length; i < il; ++i) {
	        var part = parts[i];
	        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;
	
	        if (pos === -1) {
	            obj[Utils.decode(part)] = '';
	        }
	        else {
	            var key = Utils.decode(part.slice(0, pos));
	            var val = Utils.decode(part.slice(pos + 1));
	
	            if (Object.prototype.hasOwnProperty(key)) {
	                continue;
	            }
	
	            if (!obj.hasOwnProperty(key)) {
	                obj[key] = val;
	            }
	            else {
	                obj[key] = [].concat(obj[key]).concat(val);
	            }
	        }
	    }
	
	    return obj;
	};
	
	
	internals.parseObject = function (chain, val, options) {
	
	    if (!chain.length) {
	        return val;
	    }
	
	    var root = chain.shift();
	
	    var obj = {};
	    if (root === '[]') {
	        obj = [];
	        obj = obj.concat(internals.parseObject(chain, val, options));
	    }
	    else {
	        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
	        var index = parseInt(cleanRoot, 10);
	        var indexString = '' + index;
	        if (!isNaN(index) &&
	            root !== cleanRoot &&
	            indexString === cleanRoot &&
	            index >= 0 &&
	            index <= options.arrayLimit) {
	
	            obj = [];
	            obj[index] = internals.parseObject(chain, val, options);
	        }
	        else {
	            obj[cleanRoot] = internals.parseObject(chain, val, options);
	        }
	    }
	
	    return obj;
	};
	
	
	internals.parseKeys = function (key, val, options) {
	
	    if (!key) {
	        return;
	    }
	
	    // The regex chunks
	
	    var parent = /^([^\[\]]*)/;
	    var child = /(\[[^\[\]]*\])/g;
	
	    // Get the parent
	
	    var segment = parent.exec(key);
	
	    // Don't allow them to overwrite object prototype properties
	
	    if (Object.prototype.hasOwnProperty(segment[1])) {
	        return;
	    }
	
	    // Stash the parent if it exists
	
	    var keys = [];
	    if (segment[1]) {
	        keys.push(segment[1]);
	    }
	
	    // Loop through children appending to the array until we hit depth
	
	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {
	
	        ++i;
	        if (!Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {
	            keys.push(segment[1]);
	        }
	    }
	
	    // If there's a remainder, just add whatever is left
	
	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }
	
	    return internals.parseObject(keys, val, options);
	};
	
	
	module.exports = function (str, options) {
	
	    if (str === '' ||
	        str === null ||
	        typeof str === 'undefined') {
	
	        return {};
	    }
	
	    options = options || {};
	    options.delimiter = typeof options.delimiter === 'string' || Utils.isRegExp(options.delimiter) ? options.delimiter : internals.delimiter;
	    options.depth = typeof options.depth === 'number' ? options.depth : internals.depth;
	    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : internals.arrayLimit;
	    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : internals.parameterLimit;
	
	    var tempObj = typeof str === 'string' ? internals.parseValues(str, options) : str;
	    var obj = {};
	
	    // Iterate over the keys and setup the new object
	
	    var keys = Object.keys(tempObj);
	    for (var i = 0, il = keys.length; i < il; ++i) {
	        var key = keys[i];
	        var newObj = internals.parseKeys(key, tempObj[key], options);
	        obj = Utils.merge(obj, newObj);
	    }
	
	    return Utils.compact(obj);
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(70);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getDesc    = $.getDesc
	    , getSymbols = $.getSymbols;
	  if(getSymbols)$.each.call(getSymbols(it), function(key){
	    if(getDesc(it, key).enumerable)keys.push(key);
	  });
	  return keys;
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// Load modules
	
	
	// Declare internals
	
	var internals = {};
	
	
	exports.arrayToObject = function (source) {
	
	    var obj = {};
	    for (var i = 0, il = source.length; i < il; ++i) {
	        if (typeof source[i] !== 'undefined') {
	
	            obj[i] = source[i];
	        }
	    }
	
	    return obj;
	};
	
	
	exports.merge = function (target, source) {
	
	    if (!source) {
	        return target;
	    }
	
	    if (typeof source !== 'object') {
	        if (Array.isArray(target)) {
	            target.push(source);
	        }
	        else {
	            target[source] = true;
	        }
	
	        return target;
	    }
	
	    if (typeof target !== 'object') {
	        target = [target].concat(source);
	        return target;
	    }
	
	    if (Array.isArray(target) &&
	        !Array.isArray(source)) {
	
	        target = exports.arrayToObject(target);
	    }
	
	    var keys = Object.keys(source);
	    for (var k = 0, kl = keys.length; k < kl; ++k) {
	        var key = keys[k];
	        var value = source[key];
	
	        if (!target[key]) {
	            target[key] = value;
	        }
	        else {
	            target[key] = exports.merge(target[key], value);
	        }
	    }
	
	    return target;
	};
	
	
	exports.decode = function (str) {
	
	    try {
	        return decodeURIComponent(str.replace(/\+/g, ' '));
	    } catch (e) {
	        return str;
	    }
	};
	
	
	exports.compact = function (obj, refs) {
	
	    if (typeof obj !== 'object' ||
	        obj === null) {
	
	        return obj;
	    }
	
	    refs = refs || [];
	    var lookup = refs.indexOf(obj);
	    if (lookup !== -1) {
	        return refs[lookup];
	    }
	
	    refs.push(obj);
	
	    if (Array.isArray(obj)) {
	        var compacted = [];
	
	        for (var i = 0, il = obj.length; i < il; ++i) {
	            if (typeof obj[i] !== 'undefined') {
	                compacted.push(obj[i]);
	            }
	        }
	
	        return compacted;
	    }
	
	    var keys = Object.keys(obj);
	    for (i = 0, il = keys.length; i < il; ++i) {
	        var key = keys[i];
	        obj[key] = exports.compact(obj[key], refs);
	    }
	
	    return obj;
	};
	
	
	exports.isRegExp = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};
	
	
	exports.isBuffer = function (obj) {
	
	    if (obj === null ||
	        typeof obj === 'undefined') {
	
	        return false;
	    }
	
	    return !!(obj.constructor &&
	        obj.constructor.isBuffer &&
	        obj.constructor.isBuffer(obj));
	};


/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map