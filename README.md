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

Pass in an options object.
```
var videoStage = document.getElementById('video_stage')
var videoOptions = {
  url: 'http://videos.thisisepic.com/2b9c1bf3-e19b-4be5-9d36-246c5d3607d8/high.mp4',
  poster: 'http://thumbnails.thisisepic.com/b1ce00de-e687-4c1b-97ac-afa05a287327/large/frame_0005.png'
};
React.render(<VideoPlayer options={videoOptions} />, videoStage);
```

## Options
| Name | Type | Description |
| ---- | ---- | ----------- |
| **url** | String | Any video file supported by HTML5 Video Tag
| **poster** | String | jpg, png



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

- ~~Volume Slider~~
- Full Screen (partial support)
- ~~Responsive~~
- Choose resolution
- Playlists
- Seeking, FF, RW
- Change playback speed

## Changelog
- Fri Mar 13
  - Volume slider should work in most modern browsers
- Thu Mar 12
 - Full screen support for webkit, rest coming soon
 - video remains centered and keeps aspect ratio
