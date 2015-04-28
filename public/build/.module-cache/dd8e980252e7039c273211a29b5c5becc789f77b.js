var Player = function(options){
  this.config = {}
  this.defaults = {
    high_def: 'http://videos.thisisepic.com/88bce6ad-a343-4fb0-8df1-66471545ae96/high.mp4',
    low_def: ''
  }
  for (var key in options){
    this.defaults[key] = options[key]
  }
}

var VideoPlayer = React.createClass({displayName: "VideoPlayer",
  render: function(){
    return (
      React.createElement("div", {className: "video_player"}, 
        React.createElement("video", {src: "http://videos.thisisepic.com/88bce6ad-a343-4fb0-8df1-66471545ae96/high.mp4"})
      )
    )
  }
})
