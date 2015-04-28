var Player = function(options){
  this.config = {}
  this.defaults = {
    high_def: '',
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
        React.createElement("video", {src: ""})
      )
    )
  }
})
