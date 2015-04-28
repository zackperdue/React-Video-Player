var Player = function(video, options){
  this.video = video
  this.config = {}
  this.defaults = {
    highQuality: 'http://videos.thisisepic.com/88bce6ad-a343-4fb0-8df1-66471545ae96/high.mp4',
    lowQuality: '',
    initialQuality: 'highQuality',
    poster: ''
  }
  for (var key in options){
    this.config[key] = this.defaults[key]
    this.config[key] = options[key]
  }

  delete this.defaults

  this.getInitialQualityMedia = function(){
    return this.config[this.config['initialQuality']]
  }
  this.setVideoPoster = function(url){
    this.video.poster = url
    return this
  }
  this.setVideoSource = function(quality, time){
    var time = null
    var source = this.config[quality]
    this.video.src = source
    return this
  }
  this.toggleVolume = function(callback){
    this.video.muted = !this.video.muted
    callback(this.getVolumeState())
    return this
  }
  this.getVolumeState = function(){
    return this.video.muted ? 'muted' : 'on'
  }
  this.togglePlayback = function(callback){
    if (this.video.paused){
      this.video.play()
    }else{
      this.video.pause()
    }
    callback(this.getPlaybackState())
    return this
  }
  this.getPlaybackState = function(){
    return this.video.paused ? 'paused' : 'playing'
  }
  this.setCurrentTime = function(time){
    this.video.currentTime = time
    return this
  }
}

var VideoPlayer = React.createClass({
  getInitialState: function(){
    return {
      player: {},
      playbackState: 'paused'
    }
  },
  componentDidMount: function(){
    var video = React.findDOMNode(this.refs.video)
    var player = new Player(video, this.props.options)
    player.setVideoPoster(player.config.poster)
    player.setVideoSource(player.config.initialQuality, 0)
    video.addEventListener('mousemove', function(e){
      console.log(e.pageX)
    })
    document.addEventListener('mousedown', function(e){
      console.log(e.pageX)
    })
    this.setState({
      player: player
    })
  },
  togglePlayback: function(e){
    this.state.player.togglePlayback(function(playbackState){
      this.setState({
        playbackState: playbackState
      })
    }.bind(this))
  },
  toggleVolume: function(e){
    this.state.player.toggleVolume(function(volumeState){
      this.setState({
        volumeState: volumeState
      })
    }.bind(this))
  },
  toggleFullscreen: function(e){

  },
  render: function(){
    var playbackIcon = {
      playing: 'icon-pause',
      paused: 'icon-play'
    }
    return (
      <div className="video_player">
        <video ref="video"></video>
        <div className="control_bar">
          <button onClick={this.togglePlayback}><i className={playbackIcon[this.state.playbackState]}></i></button>
          <button onClick={this.toggleVolume}><i className="icon-volume-medium"></i></button>
          <button onClick={this.toggleFullscreen}><i className="icon-fullscreen"></i></button>
          <div className="progress_bar">
            <div className="played">
              <button className="seeker"></button>
            </div>
            <div className="buffer"></div>
          </div>
        </div>
      </div>
    )
  }
})
