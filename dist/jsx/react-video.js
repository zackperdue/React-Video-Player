Number.prototype.toVideoDuration = function(){
  var hours, minutes, seconds, group;
  group = []

  hours = Math.floor(this /  3600);
  minutes = Math.floor(this % 3600 / 60);
  seconds = Math.floor(this % 3600 % 60);

  if (hours > 0) { group.push((hours > 9) ? hours : "0" + hours); }
  group.push((minutes > 9) ? minutes : "0" + minutes);
  group.push((seconds > 9) ? seconds : "0" + seconds);

  return group.join(":");
}

var VideoFullScreenToggleButton = React.createClass({displayName: "VideoFullScreenToggleButton",
  requestFullscreen: function(){
    this.props.onToggleFullscreen();
  },
  render: function(){
    return (
      React.createElement("button", {className: "toggle_fullscreen_button", onClick: this.requestFullscreen}, 
        React.createElement("i", {className: "icon-fullscreen"})
      )
    );
  }
});

var VideoTimeIndicator = React.createClass({displayName: "VideoTimeIndicator",
  render: function(){
    var current = (this.props.currentTime).toVideoDuration();
    var duration = (this.props.duration).toVideoDuration();
    return (
      React.createElement("div", {className: "time"}, 
        React.createElement("span", {className: "current"}, current), "/", React.createElement("span", {className: "total"}, duration)
      )
    );
  }
});

var VideoVolumeButton = React.createClass({displayName: "VideoVolumeButton",
  toggleVolume: function(){
    this.props.toggleVolume(!this.props.muted);
  },
  changeVolume: function(e){

  },
  render: function(){
    var volumeLevel, level;
    volumeLevel = this.props.volumeLevel;
    switch(volumeLevel){
      case volumeLevel > 0:
        level = 'low';
      case volumeLevel > 0.33:
        level = 'medium';
      case volumeLevel > 0.66:
        level = 'high'
      default:
        level = 'medium'
    }

    level = (this.props.muted == true ? 'muted' : level);

    var sound_levels = {
      'muted': 'icon-volume-off',
      'low': 'icon-volume-down',
      'medium': 'icon-volume',
      'high': 'icon-volume-up'
    }

    return (
      React.createElement("div", {className: "volume", onClick: this.toggleVolume}, 
        React.createElement("i", {className: sound_levels[level]})
      )
    );
  }
});

var VideoPlaybackToggleButton = React.createClass({displayName: "VideoPlaybackToggleButton",
  render: function(){
    var icon = this.props.playing ? (React.createElement("i", {className: "icon-pause"})) : (React.createElement("i", {className: "icon-play"}));
    return (
      React.createElement("button", {className: "toggle_playback", onClick: this.props.handleTogglePlayback}, 
        icon
      )
    );
  }
});

var VideoProgressBar = React.createClass({displayName: "VideoProgressBar",
  render: function(){
    var playedStyle = {width: this.props.percentPlayed + '%'}
    var bufferStyle = {width: this.props.percentBuffered + '%'}
    return (
      React.createElement("div", {className: "progress_bar"}, 
        React.createElement("div", {className: "playback_percent", style: playedStyle}), 
        React.createElement("div", {className: "buffer_percent", style: bufferStyle})
      )
    );
  }
});

var Video = React.createClass({displayName: "Video",
  updateCurrentTime: function(times){
    this.props.currentTimeChanged(times);
  },
  updateDuration: function(duration){
    this.props.durationChanged(duration);
  },
  playbackChanged: function(shouldPause){
    this.props.updatePlaybackStatus(shouldPause);
  },
  updateBuffer: function(buffered){
    this.props.bufferChanged(buffered);
  },
  componentDidMount: function(){
    var video = this.getDOMNode();

    $this = this

    // Sent when playback completes
    video.addEventListener('ended', function(e){
      $this.playbackChanged(e.target.ended);
    }, false);

    var bufferCheck = setInterval(function(){
      var percent = (video.buffered.end(0) / video.duration * 100)
      $this.updateBuffer(percent);
      if (percent == 100) { clearInterval(bufferCheck); }
    }, 500);

    video.addEventListener('durationchange', function(e){
      $this.updateDuration(e.target.duration);
    }, false);

    video.addEventListener('timeupdate', function(e){
      $this.updateCurrentTime({
        currentTime: e.target.currentTime,
        duration: e.target.duration
      });
    }, false)
  },
  render: function(){
    return (
      React.createElement("video", {src: this.props.url})
    );
  }
});

var VideoPlayer = React.createClass({displayName: "VideoPlayer",
  getInitialState: function(){
    return {
      playing: false,
      percentPlayed: 0,
      percentBuffered: 0,
      duration: 0,
      currentTime: 0,
      muted: false,
      volumeLevel: 0.5,
      fullScreen: false,
    };
  },
  videoEnded: function(){
    this.setState({
      percentPlayed: 100,
      playing: false
    });
  },
  togglePlayback: function(){
    this.setState({
      playing: !this.state.playing
    }, function(){
      if (this.state.playing){
        this.refs.video.getDOMNode().play()
      }else{
        this.refs.video.getDOMNode().pause()
      }
    });
  },
  updateDuration: function(duration){
    this.setState({duration: duration});
  },
  updateBufferBar: function(buffered){
    this.setState({percentBuffered: buffered});
  },
  updateProgressBar: function(times){
    var percentPlayed = Math.floor((100 / times.duration) * times.currentTime);
    this.setState({
      currentTime: times.currentTime,
      percentPlayed: percentPlayed,
      duration: times.duration
    });
  },
  toggleMute: function(){
    this.setState({
      muted: !this.state.muted
    }, function(){
      this.refs.video.getDOMNode().muted = this.state.muted
    });
  },
  toggleFullscreen: function(){
    this.setState({
      fullScreen: !this.state.fullScreen
    }, function(){
      if (this.state.fullScreen){
        this.getDOMNode().webkitRequestFullScreen();
      }else{
        document.webkitExitFullscreen();
      }
    });
  },
  render: function(){
    return (
      React.createElement("div", {className: "video_player"}, 
        React.createElement(Video, {ref: "video", 
               url: this.props.url, 
               currentTimeChanged: this.updateProgressBar, 
               durationChanged: this.updateDuration, 
               updatePlaybackStatus: this.videoEnded, 
               bufferChanged: this.updateBufferBar}), 
        React.createElement("div", {className: "video_controls", ref: "videoControls"}, 
          React.createElement(VideoProgressBar, {percentPlayed: this.state.percentPlayed, percentBuffered: this.state.percentBuffered}), 
          React.createElement(VideoPlaybackToggleButton, {handleTogglePlayback: this.togglePlayback, playing: this.state.playing}), 
          React.createElement(VideoVolumeButton, {muted: this.state.muted, volumeLevel: this.state.volumeLevel, toggleVolume: this.toggleMute}), 
          React.createElement(VideoTimeIndicator, {duration: this.state.duration, currentTime: this.state.currentTime}), 
          React.createElement("div", {className: "rhs"}, 
            React.createElement(VideoFullScreenToggleButton, {onToggleFullscreen: this.toggleFullscreen})
          )
        )
      )
    );
  }
});

var videoStage = document.getElementById('video_stage')
React.render(React.createElement(VideoPlayer, {url: "http://videos.thisisepic.com/2b9c1bf3-e19b-4be5-9d36-246c5d3607d8/high.mp4"}), videoStage);
