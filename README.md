# ReactJS Video

An HTML5 Video Player ReactJS Component

![ReactJS Video](screenshot.png)

Originally created for [thisisepic.com](http://thisisepic.com) but is able to be used in any web project commercial or open source.

Feel free to open pull requests with added features, or you can open a ticket if you'd like to see a feature added.

# How to use
Include react and the react video library in your document, then render the component to any element you wish.

```
<div id="video_stage"></div>
<script type="text/javascript" src="dist/jsx/react-video.js"></script>
```

```
var videoStage = document.getElementById('video_stage')
React.render(<VideoPlayer url="http://videos.thisisepic.com/2b9c1bf3-e19b-4be5-9d36-246c5d3607d8/high.mp4" />, videoStage);
```

## Modifying

If you'd like to modify the css or jsx, you'll need to recompile the project using sass and jsx. Run these commands from the root directory:
```
sass --watch src/sass:dist/css
```
and or 
```
jsx --watch src/ dist/
```

## Todo

- Volume Slider
- Full Screen
- Responsive
- Choose resolution
- Playlists
- Seeking, FF, RW
- Change playback speed
