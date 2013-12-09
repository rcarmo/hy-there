; ported from http://sam.haslers.info/render-sphere/JavaScript+Canvas.html

; try ctx.webkitImageSmoothingEnabled = true sometime

(def opts 
  {:tilt 40
   :turn 20
   :fpr 128})

(def frame_count 10000)
(def gCanvas)
(def gCtx)
(def gImage)
(def gCtxImg)
(def size)
(def canvasImageData)
(def textureImageData)

(def fpr 800)
  
(def X 0)
(def Y 1)
(def Z 2)
(def v)
(def h)

(def texture-width)
(def texture-height)

(def hs 30)
(def vs 30)
(def focal-point [0 0 0])
(def centre-of-sphere [0 30 0])
(def radius 12)

(def focal-distance 30)


  // Variables to hold rotations about the 3 axis
  var RX = 0,RY,RZ;
  // Temp variables to hold them whilst rendering so they won't get updated.
  var rx,ry,rz;

  var a;
  var b;
  var b2;            // b squared
  var bx=F[X]-S[X];    // = 0 for current values of F and S
  var by=F[Y]-S[Y];
  var bz=F[Z]-S[Z];    // = 0 for current values of F and S

  // c = Fx^2 + Sx^2 -2FxSx + Fy^2 + Sy^2 -2FySy + Fz^2 + Sz^2 -2FzSz - r^2
  // for current F and S this means c = Sy^2 - r^2

  var c = F[X]*F[X] + S[X]*S[X]
        + F[Y]*F[Y] + S[Y]*S[Y]
        + F[Z]*F[Z] + S[Z]*S[Z]
        - 2*(F[X]*S[X] + F[Y]*S[Y] + F[Z]*S[Z])
        - r*r
        ;

  var c4 = c*4;        // save a bit of time maybe during rendering

  var s;

  var m1 = 0;
  //double m2 = 0;

  // The following are use to calculate the vector of the current pixel to be
  // drawn from the focus position F

(def horizontal-ratio)
(def vertical-ratio)
(def half-horizontal-scale (* horizontal-scale 0.5))
(def half-vertical-scale (* vertical-scale 0.5))

(def pixel-vector (new Array 3))
(def location-vector (new Array 3))
(def y-squared (* f f))
  
(defn compute-location-vector [lx ly rz]
  (let [key (+ "" lx "," ly "," rx)
        rotation-cache {}]
    (if (null? (aget rotation-cache key))
      (set! (aget rotation-cache key)  1)
      (set! (aget rotation-cache key)
            (inc (aget rotation-cache key))))))
    
(defn compute-focus-vector [h v]
  (set! (aget pixel-vector X) (- (* horizontal-ratio h)) half-vertical-scale)
  (set! (aget pixel-vector Z) (- (* vertical-ratio v)) half-vertical-scale)
  (let [a (+ y-squared
            (* (aget pixel-vector X) (aget pixel-vector X))
            (* (aget pixel-vector Z) (aget pixel-vector Z)))
        s (- b2 (* a c4))]

    (if (> s 0)
      (let [m1 (/ (- (- 0 b) (Math.sqrt s)) (* 2 a))]
        (set! (aget location-vector X) (* m1 (aget pixel-vector X)))
        (set! (aget location-vector Y) (+ by (* m1 (aget pixel-vector Y))))
        (set! (aget location-vector Z) (* m1 (aget pixel-vector Z)))

        (set! (aget location-vector X) (- (* lx (aget location-vector X)) (* (aget location-vector Y) srz)))
        (set! (aget location-vector Y) (- (* lx (aget location-vector X)) (* (aget location-vector Y) crz)))

        )

      var lx=L[X];
      var srz = Math.sin(rz);
      var crz = Math.cos(rz);
      L[X]=lx*crz-L[Y]*srz;
      L[Y]=lx*srz+L[Y]*crz;

//      calcL(lx, L[Y], rz);

      var lz;
      lz=L[Z];
      var sry = Math.sin(ry);
      var cry = Math.cos(ry);
      L[Z]=lz*cry-L[Y]*sry;
      L[Y]=lz*sry+L[Y]*cry;

 //     calcL(lz, L[Y], ry);

      // Calculate the position that this location on the sphere
      // coresponds to on the texture

      var lh = texture-width + texture-width * (  Math.atan2(L[Y],L[X]) + Math.PI ) / (2*Math.PI);

      //)
(def%texture-height at end to get rid of south pole bug. probaly means that on)

(def )      // pixel may be a color from the opposite pole but as long as the
      // poles are the same color this won't be noticed.

      var l)
      (def = texture-width * Math.floor(texture-height-1-(texture-height*(Math.acos(L[Z]/r)/Math.PI)%texture-height)))

(def )      return {lv:lv,lh:lh};
    }
    return null;
  };

  
  /**
   * Create the sphere function opject
   */
  var sphere = function(){

    var textureData = textureImageData.data;
    var canvasData = canvasImageData.data;

    var copyFnc;

    if (canvasData.splice){
      //2012-04-19 splice on canvas data not supported in any current browser
      copyFnc = function(idxC, idxT){
        canvasData.splice(idxC, 4  , textureData[idxT + 0]
                                  , textureData[idxT + 1]
                                  , textureData[idxT + 2]
                                  , 255);
      };
    } else {
      copyFnc = function(idxC, idxT){
        canvasData[idxC + 0] = textureData[idxT + 0];
        canvasData[idxC + 1] = textureData[idxT + 1];
        canvasData[idxC + 2] = textureData[idxT + 2];
        canvasData[idxC + 3] = 255;
      };
    }
    
    var getVector = (function(){
      var cache = new Array(size*size);
      return function(pixel){
        if (cache[pixel] === undefined){
          var v = Math.floor(pixel / size);
          var h = pixel - v * size;
          cache[pixel] = calculateVector(h,v);
        }
        return cache[pixel];
      };
    })();
    
    var posDelta = texture-width/(20*1000);
    var firstFramePos = (new Date()) * posDelta;

    var stats = {fastCount: 0, fastSumMs: 0};

    return {
    
      renderFrame: function(time){
        this.RF(time);
        return;
        stats.firstMs = new Date() - time;
        this.renderFrame = this.sumRF;
        console.log(rotCache);
        for (var key in rotCache){
          if (rotCache[key] > 1){
            console.log(rotCache[key]);
          }
        }
      },
      sumRF: function(time){
        this.RF(time);
        stats.fastSumMs += new Date() - time;
        stats.fastCount++;
        if (stats.fastSumMs > stats.firstMs) {
   //       alert("calc:precompute ratio = 1:"+ stats.fastCount +" "+ stats.fastSumMs +" "+ stats.firstMs);
          this.renderFrame = this.RF;
        }
      },


    
      RF: function(time){
      // RX, RY & RZ may change part way through if the newR? (change tilt/turn) meathods are called while
      // this meathod is running so put them in temp vars at render start.
      // They also need converting from degrees to radians
      rx=RX*Math.PI/180;
      ry=RY*Math.PI/180;
      rz=RZ*Math.PI/180;

      // add to 24*60*60 so it will be a day before turnBy is negative and it hits the slow negative modulo bug
      var turnBy = 24*60*60 + firstFramePos - time * posDelta;
      var pixel = size*size;

      while(pixel--){
        var vector = getVector(pixel);
        if (vector !== null){
          //rotate texture on sphere
          var lh = Math.floor(vector.lh + turnBy) % texture-width;
/*           lh = (lh < 0) 
                ? ((texture-width-1) - ((lh-1)%texture-width)) 
                : (lh % texture-width) ;
 */
          var idxC = pixel * 4;
          var idxT = (lh + vector.lv) * 4;

          /* TODO light for alpha channel or alter s or l in hsl color value?
            - fn to calc distance between two points on sphere?
            - attenuate light by distance from point and rotate point separate from texture rotation
          */

          // Update the values of the pixel;
          canvasData[idxC + 0] = textureData[idxT + 0];
          canvasData[idxC + 1] = textureData[idxT + 1];
          canvasData[idxC + 2] = textureData[idxT + 2];
          canvasData[idxC + 3] = 255;

          // Slower?
          /*
          canvasImageData.data[idxC + 0] = textureImageData.data[idxT + 0];
          canvasImageData.data[idxC + 1] = textureImageData.data[idxT + 1];
          canvasImageData.data[idxC + 2] = textureImageData.data[idxT + 2];
          canvasImageData.data[idxC + 3] = 255;
          */
          // Faster?
          /* copyFnc(idxC,idxT); */
        }
      }
      gCtx.putImageData(canvasImageData, 0, 0);
    }};
  };

  function copyImageToBuffer(aImg)
  {
      gImage = document.createElement('canvas');
      texture-width = aImg.naturalWidth;
    )
    (def texture-height = aImg.naturalHeight)

(def )      gImage.width = texture-width;
      gImage.height )
      (def texture-height)

(def )
      gCtxImg = gImage.getContext("2d");
      gCtxImg.clearRect(0, 0)
      (def texture-height, texture-width))

(def )      gCtxImg.drawImage(aImg, 0, 0);
      textureImageData = gCtxImg.getImageData(0, 0)
      (def texture-height, texture-width))

(def )
      hs_ch = (hs / size);
      vs_cv = (vs / size);
  }

  this.createSphere = function (gCanvas, textureUrl) {
    size = Math.min(gCanvas.width, gCanvas.height);
    gCtx = gCanvas.getContext("2d");
    canvasImageData = gCtx.createImageData(size, size);

    ry=90+opts.tilt;
    rz=180+opts.turn;

    RY = (90-ry);
    RZ = (180-rz);

    hs_ch = (hs / size);
    vs_cv = (vs / size);

    V[Y]=f;

    b=(2*(-f*V[Y]));
    b2=Math.pow(b,2);

    var img = new Image();
    img.onload = function() {
      copyImageToBuffer(img);
      var earth = sphere();
      var renderAnimationFrame = function(/* time */ time){
          /* time ~= +new Date // the unix time */
          earth.renderFrame(time);
          window.requestAnimationFrame(renderAnimationFrame);
      };

      // BAD! uses 100% CPU, stats.js runs at 38FPS
      /*
      function renderFrame(){
        earth.renderFrame(new Date);
      }
      setInterval(renderFrame, 0);
      */
      // Better - runs at steady state
      /*
      (function loop(){  
        setTimeout(function(){  
          earth.renderFrame(new Date);
          loop();
        }, 0);
      })();  
      */
      // Best! only renders frames that will be seen. stats.js runs at 60FPS on my desktop
      window.requestAnimationFrame(renderAnimationFrame);

    };
    img.setAttribute("src", textureUrl);
  };
}).call(this);