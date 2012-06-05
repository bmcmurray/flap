(function(R, window, undefined) {
  var document = window.document,
      navigator = window.navigator,
      location = window.location;

  var Flap = function(selector, options) {
    var that = this;

    var init = function(selector, options) {
      var height = 50,
          width = 300,
          i = 0,
          letter = '',
          paper;

      var text = options.text || "",
          length = options.length || (text.length || 1),
          library = options.library || 'en',
          bgColor = options.bgColor || "transparent",
          textColor = options.textColor || "#ffffff",
          flapColor = options.flapColor || "#aaaaaa",
          flipColor = options.flipColor || (options.flapColor || "#aaaaaa"),
          font = options.font || "sans-serif";

      _length = length;

      setLibrary(library);

      width = (length * 35) - 5 || 30;

      that._paper = paper = R(document.getElementById(selector), width, height);

      paper.add([{
        type: "rect",
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: bgColor,
        stroke: bgColor,
        "stroke-width": 1
      }]);

      // initialize display based on length
      for (i = 0; i < length; i++) {
        _letters.push(that._paper.splitFlap(
          ' ', /* initial text is blank */
          i * 35, /* x position */
          0, /* y position */
          { library: Flap.libraries[library], 
            flapColor: flapColor, 
            flipColor: flipColor
          } 
        ));
      }
      that.text(text);

      return that;
    };

    function setLibrary(library) {
      if (!Flap.libraries) {
        throw new Error('Flap: No libraries found.');
      }
      if (!(library in Flap.libraries)) {
        throw new Error('Flap: Library "'+ library +'" not found.');
      }
      _library = library;
    }

    this.version = "0.0.1";

    var _length = 0;
    var _text = '';
    var _letters = [];
    var _library = '';

    this.size = function() {
      return _length;
    };

    this.library = function() {
      return Flap.libraries[_library];
    };

    this.text = function(text) {
      var i,
          tmpText;

      if (text === undefined) {
        return _text.trim();
      }

      if (text.length <= _length) {
        tmpText = text.split('');
        for (i = 0; i < (_length - text.length); i++) {
          tmpText.unshift(' ');
        }
        text = tmpText.join('');
      }
      else {
        // error out if attempting to set a string longer than allowed space
        throw new Error('Flap: Text exceeds area length');
      }

      // store the new text
      _text = text;

      // update each letter flap
      for (i = 0; i < text.length; i++) {
        _letters[i].setText(text[i]);
      }

      return that;
    };

    return init(selector, options);
  };

  Flap.libraries = {
    'en' : ' abcdefghijklmnopqrstuvwxyz0123456789,.?!;:\'"()[]{}/\\@#$%^&*`~-+=_'.split(''),
    'alpha' : ' abcdefghijklmnopqrstuvwxyz'.split(''),
    'alpha_numeric' : ' abcdefghijklmnopqrstuvwxyz0123456789.'.split(''),
    'numeric' : ' 0123456789.'.split(''),
    'time' : ' 0123456789:'.split('')
  };

  // expose Flap to the global namespace
  window.Flap = Flap;


  R.fn.splitFlap = R.fn.splitFlap || function(letter, x, y, options) {
    var splitFlap = function(letter, x, y, options, P) {
      var that = this,
          _letter = letter,
          _library = options.library,

          flapColor = options.flapColor || "#aaaaaa",
          flipColor = options.flipColor || (options.flapColor || "#aaaaaa"),
          darkerPercent = -35,

          // groups of individual parts
          splitFlap = P.set(),
          flipTop = P.add([
            { type: "rect",
              x: x,
              y: y,
              width: 30,
              height: 25,
              fill: flipColor,
              stroke: flipColor,
              "stroke-width": 1
            },
            { type: "text",
              x: x+15,
              y: y+25,
              text: _letter,
              fill: "#ffffff",
              "font-size": 50,
              "clip-rect": [x,y,30,25].join(' ')
            }
          ]),
          top = P.add([
            { type: "rect",
              x: x,
              y: y,
              width: 30,
              height: 25,
              fill: flapColor,
              stroke: flapColor,
              "stroke-width": 1
            },
            { type: "text",
              x: x+15,
              y: y+25,
              text: _letter,
              fill: "#ffffff",
              "font-size": 50,
              "clip-rect": [x,y,30,25].join(' ')
            }
          ]),
          bottom = P.add([
            { type: "rect",
              x: x,
              y: y+25,
              width: 30,
              height: 25,
              fill: luminance(flapColor, darkerPercent),
              stroke: luminance(flapColor, darkerPercent),
              "stroke-width": 1
            },
            { type: "text",
              x: x+15,
              y: y+25,
              text: _letter,
              fill: "#ffffff",
              "font-size": 50,
              "clip-rect": [x,y+25,30,25].join(' ')
            }
          ]),
          flipBottom = P.add([
            { type: "rect",
              x: x,
              y: y+25,
              width: 30,
              height: 25,
              fill: luminance(flipColor, darkerPercent),
              stroke: luminance(flipColor, darkerPercent),
              "stroke-width": 1
            },
            { type: "text",
              x: x+15,
              y: y+25,
              text: _letter,
              fill: "#ffffff",
              "font-size": 50,
              "clip-rect": [x,y+25,30,25].join(' ')
            }
          ]),
          split = P.rect(x, y+25, 30, 1).attr({fill: "#444444", "stroke-width": 1, stroke: "#444444"}),

          // transformation matrices
          matrixVisible = P.raphael.matrix(1,0,0,1,0,0),
          matrixFlipToCenter = P.raphael.matrix(1,0,0,0,0,y+25),

          // stored animations
          animations = {
            "flipBottom"  : 
              P.raphael.animation(
                
              )
          };

      // hide the flipped bottom
      flipBottom.transform(matrixFlipToCenter.toTransformString());

      /**
       * Utility function to lighten/darken a hex color
       *
       * Adapted from http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color
       */
      function luminance(color,amt) {
        var usePound = false;
        if ( color[0] == "#" ) {
          color = color.slice(1);
          usePound = true;
        }

        var num = parseInt(color,16);
        var r = (num >> 16) + amt;

        if ( r > 255 ) r = 255;
        else if  (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + amt;

        if ( b > 255 ) b = 255;
        else if  (b < 0) b = 0;

        var g = (num & 0x0000FF) + amt;

        if ( g > 255 ) g = 255;
        else if  ( g < 0 ) g = 0;

        return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
      }

      function flip(callback) {
        top.animate(
          {transform : matrixFlipToCenter.toTransformString()},
          200, 
          "linear", 
          function() {
            flipBottom.animate(
              {transform : matrixVisible.toTransformString()}, 
              250, 
              "linear",
              function() {
                callback.call();    
              }
            );
          }
        );
      }

      function values(array) {
        var o = {};
        for(var i=0; i < array.length; i++) {
          o[array[i]]='';
        }
        return o;
      }

      splitFlap.push(flipTop);
      splitFlap.push(top);
      splitFlap.push(bottom);
      splitFlap.push(flipBottom);

      splitFlap.push(split);

      this.setText = function(letter) {
        try {
          if (!(letter in values(_library))) {
            throw new Error('Flap: Character not in library.');
          }
          if (letter != _letter) {
            flipTop[1].attr('text', letter);
            flipBottom[1].attr('text', letter);
            flip(function() {
              _letter = letter;
              top[1].attr('text', letter);
              bottom[1].attr('text', letter);
              top.transform(matrixVisible.toTransformString());
              flipBottom.transform(matrixFlipToCenter.toTransformString());
            });
          }
        }
        catch(err) {
          if (err.message == 'Flap: Character not in library.') {
            that.setText(' ');
          }
        }
      };

      return this;
    };

    return new splitFlap(letter, x, y, options, this);
  };

})(Raphael, window);