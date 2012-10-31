WonderSlider
============

A full screen slider with automatic image positioning. <br />
Tested: FF 16(Windows), Chrome 22(Windows), Opera 12(Windows), Internet Explorer 9(Windows) <br />
Features: Images, Youtube and Vimeo videos, controls and progress bar. Can change images on the fly. <br />
TODO: Add thumbnails, slide and random effects <br />
Uses: Weer for absolute image positioning. http://github.com/RiseLedger/Weer/ <br />
License: GNU/GPL <br />


Quick Start
============
1. Include latest jQuery <br />
```
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
```
2. Grab a fresh copy of WonderSlider <br />
```
<script type="text/javascript" src="wonderslider/wonder-slider.js"></script>
```
3. Include the CSS <br />
```
<link rel="stylesheet" href="wonderslider/wonder-slider.css">
```
4. Give variables to wonder slider to init. <br />
```
	<script type="text/javascript">
		jQuery(function() {
		
				var images = [
					'https://www.youtube.com/watch?v=p_abkDLAF5Q', // Plain Youtube URL
					'http://placekitten.com/g/1000/1000',   // Simple Image
					// Objects of images with caption
					{src: 'http://placehold.it/1000x1000&text='+  Math.random(), caption: 'This is my <strong>kitten</strong> <br /> Love it so much'},
					{src: 'http://placehold.it/1000x1000&text='+  Math.random(), caption: 'This is my <strong>kitten 2</strong> <br /> Love it so much'},
					
					// Video
					'http://www.youtube.com/watch?v=89NjEeHku8o&someparam=true',
					// Object of video
					{'video' : 'youtube' , 'id' : 'D8AvEstX_3E', caption: "Hello World"},
					// Vimeo
					'http://vimeo.com/20559242',
					{video : 'vimeo', 'id':'52193530'}
				];				


				jQuery.wonderSlider(images);
		
		});
	</script>
```
<strong>The slider accepts  plain links or objects of items</strong>

Accepted Variables
============
<table>
  <tr>
    <th>Variable</th><th>Accepts</th><th>Default</th><th>Description</th>
  </tr>
  <tr>
	<td>delay</td>
	<td>any integer</td>
	<td>5000</td>
	<td>The delay between slides, in other words how much a slide is shown</td>
  </tr>
  <tr>
	<td>speed</td>
	<td>any integer</td>
	<td>400</td>
	<td>The time between the slides change</td>
  </tr>
    <tr>
	<td>preload</td>
	<td>true or false</td>
	<td>true</td>
	<td>Try preload images?</td>
  </tr>
    <tr>
	<td>autoplay</td>
	<td>true or false</td>
	<td>true</td>
	<td>If true, the slider will start by itself</td>
  </tr>
    <tr>
	<td>progressBar</td>
	<td>true or false</td>
	<td>true</td>
	<td>Show a progress bar?</td>
  </tr>
    <tr>
	<td>progressBarColor</td>
	<td>hex color with #</td>
	<td>#000</td>
	<td>The color of the progress bar</td>
  </tr>
  <tr>
	<td>color</td>
	<td>hex color with #</td>
	<td>#000</td>
	<td>The controls color</td>
  </tr>
  <tr>
	<td>firstVideoAutoplay</td>
	<td>true or false</td>
	<td>true</td>
	<td>If the first slide is set to be a video. autoplay it?</td>
  </tr>
  <tr>
	<td>stopAudioTags</td>
	<td>true or false</td>
	<td>true</td>
	<td>If <strong>firstVideoAutoplay</strong> is true, should we attempt to stop all HTML5 audio tags?</td>
  </tr>
  <tr>
	<td>youtube</td>
	<td>embed url for iframe for youtube</td>
	<td>http://www.youtube-nocookie.com/embed/%v?rel=0&amp;autoplay=%a&amp;controls=0&amp;modestbranding=1&amp;wmode=opaque, where %v is video ID</td>
	<td>Set up the structure of the video url, it might vary in future, you can enable controls here.</td>
  </tr>
  <tr>
	<td>Vimeo</td>
	<td>embed url for iframe for vimeo</td>
	<td>http://player.vimeo.com/video/%v/?autoplay=%a, where %v is video ID</td>
	<td>Set up the structure of the video url, it might vary in future, you can enable controls here.</td>
  </tr>
  <tr>
	<td>Animation</td>
	<td>fade or slide</td>
	<td>fade</td>
	<td><strong>This is unsupported yet. It should define the animation type!</strong></td>
  </tr>

</table>

Using Variables
============
```
<script type="text/javascript">
	jQuery(function() {	
		jQuery.wonderSlider(images, { speed:500, delay:7000, color:'#999' });
	});
</script>
```
You simply pass the second parameter which are the settings of the slider.

Callbacks
============
* onInit - triggers when the html is ready, but the animation isn't yet started
* onBeforeChange - triggers before starting an animation
* onAfterChange - triggers after an animation is done
* onNextClick - triggers when the next image is clicked
* onPrevClick - triggers when the prev image is clicked
* onPlayPauseClick - triggers when the play/pause button is clicked

Using callbacks
============
Before you init wonder slider, you define a callback 
```
<script type="text/javascript">
	jQuery(function() {
		function sliderIsReady()
		{
			console.log('Slider is ready');
		}
		
		function changingSlide()
		{
			console.log('Changing slide cb is called');
		}	
		jQuery.wonderSlider(images, { 'onInit': sliderIsReady , 'onBeforeChange' : changingSlide });
	});
</script>
```
