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
  this.togglePlayback = function(){
    if (this.video.paused){
      this.video.play()
    }else{
      this.video.pause()
    }
    return this
  }
  this.setCurrentTime = function(time){
    this.video.currentTime = time
    return this
  }
}

var VideoPlayer = React.createClass({displayName: "VideoPlayer",
  getInitialState: function(){
    return {
      player: {},
      playing: false
    }
  },
  componentDidMount: function(){
    var video = React.findDOMNode(this.refs.video)
    var player = new Player(video, this.props.options)
    player.setVideoPoster(player.config.poster)
    player.setVideoSource(player.config.initialQuality, 0)
    this.setState({
      player: player
    })
  },
  togglePlayback: function(e){
    this.state.player.togglePlayback(function(playing){
      this.setState({
        playing: playing
      })
    })
  },
  render: function(){
    return (
      React.createElement("div", {className: "video_player"}, 
        React.createElement("video", {ref: "video"}), 
        React.createElement("div", null, 
          React.createElement("button", {onClick: this.togglePlayback}, React.createElement("i", {className: "icon-play"})), 
          React.createElement("button", null, React.createElement("i", {className: "icon-volume-medium"})), 
          React.createElement("button", null, React.createElement("i", {className: "icon-settings"})), 
          React.createElement("button", null, React.createElement("i", {className: "icon-fullscreen"}))

        )
      )
    )
  }
})
