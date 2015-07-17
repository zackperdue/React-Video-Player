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

var VideoFullScreenToggleButton = React.createClass({
  requestFullscreen: function(){
    this.props.onToggleFullscreen();
  },
  render: function(){
    return (
      <button className="toggle_fullscreen_button" onClick={this.requestFullscreen}>
        <i className="icon-fullscreen"></i>
      </button>
    );
  }
});

var VideoTimeIndicator = React.createClass({
  render: function(){
    var current = (this.props.currentTime).toVideoDuration();
    var duration = (this.props.duration).toVideoDuration();
    return (
      <div className="time">
        <span className="current">{current}</span>/<span className="total">{duration}</span>
      </div>
    );
  }
});

var VideoVolumeButton = React.createClass({
  toggleVolume: function(){
    this.props.toggleVolume(!this.props.muted);
  },
  changeVolume: function(e){
    this.props.changeVolume(e.target.value);
  },
  render: function(){
    var volumeLevel = this.props.volumeLevel, level;
      if (volumeLevel <= 0){
        level = 'muted';
      }else if (volumeLevel > 0 && volumeLevel <= 0.33){
        level = 'low';
      }else if (volumeLevel > 0.33 && volumeLevel <= 0.66){
        level = 'medium';
      }else{
        level = 'high';
      }

    var sound_levels = {
      'muted': 'icon-volume-off',
      'low': 'icon-volume-down',
      'medium': 'icon-volume',
      'high': 'icon-volume-up'
    }

    return (
      <div className="volume">
        <button onClick={this.toggleVolume}>
          <i className={sound_levels[level]}></i>
        </button>
        <input className="volume_slider" type="range" min="0" max="100" onInput={this.changeVolume} />
      </div>
    );
  }
});

var VideoPlaybackToggleButton = React.createClass({
  render: function(){
    var icon = this.props.playing ? (<i className="icon-pause"></i>) : (<i className="icon-play"></i>);
    return (
      <button className="toggle_playback" onClick={this.props.handleTogglePlayback}>
        {icon}
      </button>
    );
  }
});

var VideoProgressBar = React.createClass({
  render: function(){
    var playedStyle = {width: this.props.percentPlayed + '%'}
    var bufferStyle = {width: this.props.percentBuffered + '%'}
    return (
      <div className="progress_bar progress_bar_ref" onClick={this.props.handleProgressClick}>
        <div className="playback_percent" style={playedStyle}><span></span></div>
        <div className="buffer_percent" style={bufferStyle}></div>
      </div>
    );
  }
});

var Video = React.createClass({
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
	  try{
        var percent = (video.buffered.end(0) / video.duration * 100)
	  } catch(ex){
	    percent = 0;
	  }
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
      <video src={this.props.url} poster={this.props.poster}></video>
    );
  }
});

var VideoPlayer = React.createClass({
  getInitialState: function(){
    return {
      playing: false,
      percentPlayed: 0,
      percentBuffered: 0,
      duration: 0,
      currentTime: 0,
      muted: false,
      volumeLevel: 0.5,
      fullScreen: false
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
		  var docElm = document.documentElement;
		  if(docElm.requestFullscreen){
			this.getDOMNode().requestFullscreen();
		  }		  
		  if(docElm.webkitRequestFullScreen){
			this.getDOMNode().webkitRequestFullScreen();
		  }
		  if(docElm.mozRequestFullScreen){
			this.getDOMNode().mozRequestFullScreen();
		  }
		  if(docElm.msRequestFullscreen){
			this.getDOMNode().msRequestFullscreen();
		  }
      }else{
          if(document.exitFullscreen){
			document.exitFullscreen();
		  }
		  if(document.mozCancelFullScreen){
			document.mozCancelFullScreen();
		  }
		  if(document.webkitCancelFullScreen){
			document.webkitCancelFullScreen();
		  }
		  if(document.msExitFullscreen){
			document.msExitFullscreen();
		  }
      }
    });
  },
  handleVolumeChange: function(value){
    this.setState({volumeLevel: value / 100}, function(){
      this.refs.video.getDOMNode().volume = this.state.volumeLevel;
    });
  },
  seekVideo: function(evt){
	var progress_barElm = evt.target;
	if(progress_barElm.className != 'progress_bar_ref'){
	  progress_barElm = evt.target.parentElement;
	};
	var progBarDims = progress_barElm.getBoundingClientRect();
	var clickPos = evt.clientX - progBarDims.left + 5;	// 5 correction factor
	var ratio = (progBarDims.width < this.state.duration) ? (progBarDims.width / this.state.duration) : (this.state.duration / progBarDims.width);
	var seekPos = (clickPos * ratio);
	this.refs.video.getDOMNode().currentTime = seekPos;
  },
  render: function(){
    return (
      <div className="video_player">
        <Video ref="video"
               url={this.props.options.url}
               volume={this.state.volumeLevel}
               poster={this.props.options.poster}
               currentTimeChanged={this.updateProgressBar}
               durationChanged={this.updateDuration}
               updatePlaybackStatus={this.videoEnded}
               bufferChanged={this.updateBufferBar} />
        <div className="video_controls" ref="videoControls">
          <VideoProgressBar handleProgressClick={this.seekVideo} percentPlayed={this.state.percentPlayed} percentBuffered={this.state.percentBuffered} />
          <VideoPlaybackToggleButton handleTogglePlayback={this.togglePlayback} playing={this.state.playing} />
          <VideoVolumeButton muted={this.state.muted} volumeLevel={this.state.volumeLevel} toggleVolume={this.toggleMute} changeVolume={this.handleVolumeChange} />
          <VideoTimeIndicator duration={this.state.duration} currentTime={this.state.currentTime} />
          <div className="rhs">
            <VideoFullScreenToggleButton onToggleFullscreen={this.toggleFullscreen} />
          </div>
        </div>
      </div>
    );
  }
});

var videoStage = document.getElementById('video_stage')
var videoOptions = {
  url: 'http://videos.thisisepic.com/2b9c1bf3-e19b-4be5-9d36-246c5d3607d8/high.mp4',
  poster: 'http://thumbnails.thisisepic.com/b1ce00de-e687-4c1b-97ac-afa05a287327/large/frame_0005.png'
};
React.render(<VideoPlayer options={videoOptions} />, videoStage);
