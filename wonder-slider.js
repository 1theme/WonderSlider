/* 
  Name: Wonder Slider
  Description: A full screen slider with automatic image positioning.
  Tested: FF 16(Windows), Chrome 22(Windows), Opera 12(Windows), Internet Explorer 9(Windows)
  Features: Images, Youtube and Vimeo videos, controls and progress bar. Can change images on the fly.
  Future: Add thumbnails, slide and random effects
  Uses: Weer for absolute image positioning see below the WonderSlider
  License: GNU/GPL
*/
;(function() {

jQuery.wonderslider = function(images, options) {
    return jQuery.wonderSlider(images, options);
}
jQuery.WonderSlider = function(images, options) {
    return jQuery.wonderSlider(images, options);
}

jQuery.wonderSlider = function(images , options) {

	 var settings = jQuery.extend( {
      'delay'   : 5000, // How much a slide is being shown
      'speed'   : 400,  // How fast should it disappear
      'preload' : true, // Attempt to preload images?
      'autoplay': true, // Start by itself, or when it's triggered
      'progressBar' : true, // Show progress bar ?
      'progressBarColor' : '#000', // Progress Bar Color
      'color'   : '#000', // The color of controls
      'onBeforeChange' : function(){}, // triggers before starting an animation
      'onAfterChange' : function(){},  // triggers after an animation
      'onInit' : function(){},         // When the html is ready ,but the animation isn't yet started
      'onNextClick' : function(){},    // When the next image is clicked
      'onPrevClick' : function(){},    // When the prev image is clicked
      'onPlayPauseClick' : function() {}, // When the play/pause is clicked
      'firstVideoAutoplay' : true, // If first frame is a video, auto play it ?
      'stopAudioTags' : true, // If play first video frame should we shut up all audio tags we find ? 
      'youtube' : "http://www.youtube-nocookie.com/embed/%v?rel=0&amp;autoplay=%a&amp;controls=0&amp;modestbranding=1&amp;wmode=opaque", // Youtube video url (in iframe) structure
      'vimeo'   : "http://player.vimeo.com/video/%v/?autoplay=%a",                               // Vimeo video url (in iframe) structure
      'animation' : "fade" // animation type, can be fade or slide (slide not working yet) //TODO: Random and slide
    }, options);

   // WSI - Wonder Slider Instance
   var WSI = {
      interval : false,
      current : false,
      progressBar : "",
      items : "",
      errors : true // developers option
   };

    WSI.getVideoID = function(string, video)
    {
        if (video.toLowerCase() == "youtube")
        {
          return string.match( /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/i)[1];
        }
        else
        {
          return string.match(/\d+/)[0];
        }
    }

      WSI.parseInput = function(ws)
      {
        var nws = new Array();
        
        if (typeof ws == "object")
        {
            for (i in ws)
            {
              if (typeof ws[i] == "string")
              {
                if (/https?:\/\/(www\.)?youtube/gi.test(ws[i]) ) 
                {
                  nws.push({'type':'youtube', 'id' : WSI.getVideoID(ws[i], "youtube") });
                } 
                else if (/https?\:\/\/vimeo\.com/gi.test(ws[i]))
                {
                  nws.push({'type':'vimeo', 'id' : WSI.getVideoID(ws[i], "vimeo") });
                }
                else
                {
                  nws.push({type : 'image', 'src' : ws[i] , 'caption' : false });
                }
              }
              else if (typeof ws[i] == "object")
              {
                if (ws[i].video !== undefined && (ws[i].video.toLowerCase() !== "vimeo" || ws[i].video.toLowerCase() !== "youtube") )
                {
                  var video = {};
                  video.type = ws[i].video.toLowerCase();
                  video.caption = ws[i].caption;
                  if (ws[i].autoplay == undefined) {
                      ws[i].autoplay = false;
                  }
                  video.autoplay = (ws[i].autoplay) ? false : true;

                  if (ws[i].id !== undefined)
                  {
                    video.id = ws[i].id;
                    nws.push(video);
                  } 
                  else if ( ws[i].url !== undefined )
                  {
                    video.url = ws[i].url;
                    nws.push(video);
                  }

                } 
                else // we assume it's an image
                {
                  var image = {'type':'image'};
                  if (ws[i].src !== undefined)
                  {
                    image.src = ws[i].src;
                    if (ws[i].caption !== undefined)
                    {
                      image.caption = ws[i].caption;
                    }
                    else
                    {
                      image.caption = false;
                    }
                    nws.push(image);
                  }
                }
              } // end if type image
            
            }//end for
        } //endif

        return nws;
   } //end fn parse

   WSI.run = function() {
      var slides = WSI.parseInput(images);

      //Creates the html markup
      WSI.buildHTML( slides );

      // Attaches events to controls
      WSI.bindEvents();

      // Variables
      WSI.progressBar = jQuery('#wonder-slider .progress-bar');
      WSI.items = jQuery('#wonder-slider ul li');
      WSI.current = jQuery('#wonder-slider .slides li.slide-0');

      // Init Event
      try {
          settings.onInit.call(WSI);
      } catch (ex){}


      jQuery('#wonder-slider').css('backgroundImage','none');

      if (WSI.current.children('img').length > 0) {
           WSI.current.children('img').attr('src' , WSI.current.children('img')[0].src + "?" + new Date().getTime() ).load(function() {
                jQuery(this).parent().addClass('active').end().fadeIn(100);
                if (settings.autoplay)
                {
                    WSI.startAnimation();
                }
           });
      } else {

          if (settings.autoplay)
          {
              WSI.startAnimation();
          }
      }
   
      

      
   };

   WSI.isPlaying = function() 
   {
      return jQuery('#wonder-slider .controls .play-pause').hasClass('playing'); 
   };

   WSI.bindEvents = function()
   {
      jQuery('#wonder-slider .controls .next').bind('click',  function() {
          try {
              settings.onNextClick.call();
          } catch (ex) {}
          
          if (WSI.isPlaying()) {
             WSI.switchSlide("next");
          } else {
            var next =  ( WSI.current.next().length > 0 ) ? WSI.current.next() : WSI.items.first();
            WSI.animate( next);
          }


      });

      jQuery('#wonder-slider .controls .prev').bind('click',  function() {
          try {
              settings.onNextClick.call();
          } catch (ex) {}

          if (WSI.isPlaying()) {
             WSI.switchSlide("prev");
          } else {
            var prev = ( WSI.current.prev().length > 0 ) ? WSI.current.prev() : WSI.items.last();
            WSI.animate( prev );
          }
      });


      jQuery('#wonder-slider .controls .play-pause').bind('click', function() {
          try {
            settings.onPlayPauseClick.call();
          } catch(ex) {}
          if (jQuery(this).hasClass('paused')) 
          {
                WSI.startAnimation();
                jQuery(this).removeClass('paused').addClass('playing');
          } else {
              window.clearInterval(WSI.interval);
              WSI.progressBar.stop().css('width', '0');
              jQuery(this).removeClass('playing').addClass('paused');
          }
      });


   };

   WSI.animateProgressBar = function() 
   {
       if (settings.progressBar)
       {
            WSI.progressBar.css('width', '0').stop().animate({'width':'100%'}, settings.delay + 10);
       }
       
   };

   WSI.startAnimation = function()
   {
        WSI.animateProgressBar();

        WSI.interval = window.setInterval(function() {

            WSI.switchSlide();

        }, settings.delay);
   };

   // Animation
   WSI.animate = function( next)
   {

        if (settings.animation == "fade")
        {
            jQuery('#wonder-slider div.caption').hide();
            WSI.current.stop().animate({opacity:0}, settings.speed, function() {
              jQuery(this).removeClass('active');
            });
            next.stop().animate({opacity:1}, settings.speed).addClass('active');
            WSI.current = next;

            //show caption
            next.children('div.caption').fadeIn(200);
            if (next.hasClass('youtube') ) 
            {
                WSI.videoFrame(WSI.current, "youtube");
            }

            if (next.hasClass('vimeo'))
            {
              WSI.videoFrame(WSI.current, "vimeo");
            }
        }
   };

   // If current frame is video
   WSI.videoFrame = function(frame, from)
   {
      // @TODO: Include YoutubeAPI, Vimeo API and autostart these videos
   };

   WSI.switchSlide = function(to)
   {

       try {
          settings.onBeforeChange.call(WSI);
       } catch(ex) {};

       WSI.animateProgressBar();

       if (typeof to == "undefined") 
       {
           var next =  ( WSI.current.next().length > 0 ) ? WSI.current.next() : WSI.items.first();
           WSI.animate( next);
       } else if (to == "next")
       {
          window.clearInterval(WSI.interval);
           WSI.interval = window.setInterval(function() {

              WSI.switchSlide("next");

          }, settings.delay);

          var next =  ( WSI.current.next().length > 0 ) ? WSI.current.next() : WSI.items.first();
          WSI.animate(next);

       } else if (to == "prev")
       {
           window.clearInterval(WSI.interval);
           WSI.interval = window.setInterval(function() {

              WSI.switchSlide("next");

          }, settings.delay);
          var prev = ( WSI.current.prev().length > 0 ) ? WSI.current.prev() : WSI.items.last();
          WSI.animate(prev);
       }


       try {
          settings.onAfterChange.call(WSI);
       } catch(ex) {};

   };

   WSI.buildHTML = function (slides) 
   { 
        jQuery('#wonder-slider').remove();
        var html = "<div id='wonder-slider'><ul class='slides'>";
        for(i in slides) 
        {
            var slide = slides[i];
            var odd_even = ((i % 2) == 0) ? "odd" : "even";
            var active = (i == 0) ? " active " : "";

            html += "<li class='"+slide.type + active +" slide-"+i+" "+odd_even+"'>";
            if (slide.type == "youtube")
            {
                if (i == 0 && settings.firstVideoAutoplay == true) {
                    WSI.stopAudioTags();
                    var href = settings.youtube.replace("%v", slide.id).replace("%a", 1);
                } else {
                    var href = settings.youtube.replace("%v", slide.id).replace("%a", 0);
                }
                

                if (slide.caption)
                {
                    html+= "<div class='caption'>" + slide.caption + "</div>";
                }
                html += "<iframe data-id='"+slide.id+"' data-from='youtube' data-autoplay='"+slide.autoplay+"' frameborder='0' src='"+ href +"'></iframe>";
            }
            else if (slide.type == "vimeo")
            {
                if (slide.caption)
                {
                    html+= "<div class='caption'>" + slide.caption + "</div>";
                }

                if (i == 0 && settings.firstVideoAutoplay == true) 
                {
                    var href = settings.vimeo.replace("%v", slide.id).replace("%a", true);
                    WSI.stopAudioTags();
                }
                else
                {
                  var href = settings.vimeo.replace("%v", slide.id).replace("%a", false);
                }
                
                html += "<iframe data-id='"+slide.id+"' data-from='vimeo' data-autoplay='"+slide.autoplay+"' frameborder='0' src='"+ href +"'></iframe>";
            }
            else
            {
                if (settings.preload) WSI.preloadImage(slide.src);
                if (slide.caption)
                {
                    html+= "<div class='caption'>" + slide.caption + "</div>";
                }
                html += "<img src='"+slide.src+"' />";
                
            }

            html += "</li>";
        }

        html += "</ul>";
        if (slides.length > 1)
        {
             html += "<div class='progress-bar'></div><div class='controls'><div class='prev'><span></span></div><div class='play-pause playing'><span></span></div><div class='next'><span></span></div></div>";
        }
       
        jQuery('body').append(html);
        
        WSI.styling();

        // run weer to position all images
        try {
          jQuery('#wonder-slider ul li img').weer();
        } catch(ex) {}
        
       

        
   };

   WSI.styling = function()  
   {
      jQuery('#wonder-slider .controls div').css({'background-color': settings.color, 'opacity':'0.6'}).hover(function() {
          jQuery(this).css('opacity',1);
      }, function() { jQuery(this).css('opacity', 0.6);});

      jQuery('#wonder-slider .progress-bar').css({'background-color': settings.progressBarColor});
   };

   WSI.stopAudioTags = function() 
   {  
        jQuery('audio').each(function() {
            this.pause();
        });
   };

   WSI.preloadImage = function( src )
   {
      try 
      {
          var img = new Image();
          img.src = src;
      } catch (ex)
      {
          if (WSI.errors) console.warn(ex);
      }
   };

   WSI.run();


} // jQuery.wonderSlider 

})(jQuery);



/* Weer, http://github.com/RiseLedger/Weer */
(function(e){e.extend(e.fn,{weer:function(){var e={init:function(t){jQuery(t).hide();var n=e.getDimensions(t);e.getCenter(t,n.width,n.height),jQuery(t).fadeIn(350),jQuery(window).resize(function(){e.getCenter(t,n.width,n.height)}),jQuery(t).fadeIn(100)},getDimensions:function(e){var t=new Array;return typeof e!="undefined"?(t.width=e.naturalWidth,t.height=e.naturalHeight):(t.width=window.innerWidth,t.height=window.innerHeight),t},getCenter:function(t,n,r){$this=jQuery(t);var i=e.getDimensions(),s=e.getReverse(n,r,i.width,i.height),o=s.height>i.height?-((s.height-i.height)/2):0,u=s.width>i.width?-((s.width-i.width)/2):0;jQuery($this).css({top:o+"px",left:u+"px",width:s.width+"px",height:s.height+"px",position:"fixed"})},getReverse:function(e,t,n,r){var i=new Array;return n>r?(i.width=n,i.height=n*t/e,i.height<r&&(i.height=r,i.width=e*r/t),i):(i.height=r,i.width=e*r/t,i.width<n&&(i.width=n,i.height=n*t/e),i)}};return jQuery(this).each(function(){jQuery(this).load(function(){e.init(this)})})}})})(jQuery)