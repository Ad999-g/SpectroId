

console.clear();

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

//******Emotion stuff**********//

var vid = document.getElementById('videoel');
var vid_width = vid.width;
var vid_height = vid.height;
var webgl_overlay = document.getElementById('webgl');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var photoCanvas = document.querySelector('#photoCanvas');
var ec = new emotionClassifier();
// canvas for copying videoframes to
var videocanvas = document.createElement('CANVAS');
videocanvas.width = vid_width;
videocanvas.height = vid_height;
var premotion = [];
var fd = new faceDeformer();
var pn, pos, cp;
var happytxt = document.getElementById("happy");
var surprisedtxt = document.getElementById("wow");
var sadtxt = document.getElementById("sad");
var angrytxt = document.getElementById("angry");
var animationRequest;
//****** SPECTRO stuff **************//         
var w = 500,h = 410;
var img, video, frame, bw, ctx;
var btnBool = false;
var StS = document.getElementById("StS");
const CVS = document.body.querySelector('#spectrogram');
const CTX = CVS.getContext('2d');

//***** Object + arrays for SPECTRO frequency

var tnv = {};
var note = [];
var note2 =[];
var note3 = [];
var note4 = [];



/*********** Setup of video/webcam and checking for webGL support *********/
var videoReady = false;
var imagesReady = false;

function enablestart() {
  if (videoReady && imagesReady) {
    var startbutton = document.getElementById('startbutton');
    startbutton.value = "start";
    startbutton.disabled = null;
  }
}


$(window).load(function () {
  // executes when complete page is fully loaded, including all frames, objects and images
  imagesReady = true;
  enablestart();
});

// check whether browser supports webGL
var webGLContext;
var webGLTestCanvas = document.createElement('canvas');
if (window.WebGLRenderingContext) {
  webGLContext = webGLTestCanvas.getContext('webgl') || webGLTestCanvas.getContext('experimental-webgl');
  if (!webGLContext || !webGLContext.getExtension('OES_texture_float')) {
    webGLContext = null;
  }
}
if (webGLContext == null) {alert("Your browser does not seem to support WebGL.Face mask depends on WebGL, so you'll have to try it in another browser. :(");
}

function gumSuccess(stream) {
  // add camera stream if getUserMedia succeeded
  if ("srcObject" in vid) {
    video = document.createElement('video');
    vid.srcObject = stream;
    const input = document.getElementById('video');
  } else {
    vid.src = window.URL && window.URL.createObjectURL(stream);
  }
  vid.onloadedmetadata = function () {
    // resize overlay and video if proportions are different
    var proportion = vid.videoWidth / vid.videoHeight;
    vid_width = Math.round(vid_height * proportion);
    vid.width = vid_width;
    webgl_overlay.width = vid_width;
    videocanvas.width = vid_width;
    overlay.width = vid_width;
    fd.init(webgl_overlay);
    vid.play();
  };
}

function gumFail() {
  // fall back to video if getUserMedia failed	
  alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
}
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
// check for camerasupport
if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(gumSuccess).catch(gumFail);
} else if (navigator.getUserMedia) {
  navigator.getUserMedia({ video: true }, gumSuccess, gumFail);
} else {

  alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
}

//****** click START Event **********//

vid.addEventListener('canplay', function () {videoReady = true;enablestart();}, false);

/*********** Code for face substitution *********/
var mouth_vertices = [
[44, 45, 61, 44],
[45, 46, 61, 45],
[46, 60, 61, 46],
[46, 47, 60, 46],
[47, 48, 60, 47],
[48, 59, 60, 48],
[48, 49, 59, 48],
[49, 50, 59, 49],
[50, 51, 58, 50],
[51, 52, 58, 51],
[52, 57, 58, 52],
[52, 53, 57, 52],
[53, 54, 57, 53],
[54, 56, 57, 54],
[54, 55, 56, 54],
[55, 44, 56, 55],
[44, 61, 56, 44],
[61, 60, 56, 61],
[56, 57, 60, 56],
[57, 59, 60, 57],
[57, 58, 59, 57],
[50, 58, 59, 50]];

var extendVertices = [
[0, 71, 72, 0],
[0, 72, 1, 0],
[1, 72, 73, 1],
[1, 73, 2, 1],
[2, 73, 74, 2],
[2, 74, 3, 2],
[3, 74, 75, 3],
[3, 75, 4, 3],
[4, 75, 76, 4],
[4, 76, 5, 4],
[5, 76, 77, 5],
[5, 77, 6, 5],
[6, 77, 78, 6],
[6, 78, 7, 6],
[7, 78, 79, 7],
[7, 79, 8, 7],
[8, 79, 80, 8],
[8, 80, 9, 8],
[9, 80, 81, 9],
[9, 81, 10, 9],
[10, 81, 82, 10],
[10, 82, 11, 10],
[11, 82, 83, 11],
[11, 83, 12, 11],
[12, 83, 84, 12],
[12, 84, 13, 12],
[13, 84, 85, 13],
[13, 85, 14, 13],
[14, 85, 86, 14],
[14, 86, 15, 14],
[15, 86, 87, 15],
[15, 87, 16, 15],
[16, 87, 88, 16],
[16, 88, 17, 16],
[17, 88, 89, 17],
[17, 89, 18, 17],
[18, 89, 93, 18],
[18, 93, 22, 18],
[22, 93, 21, 22],
[93, 92, 21, 93],
[21, 92, 20, 21],
[92, 91, 20, 92],
[20, 91, 19, 20],
[91, 90, 19, 91],
[19, 90, 71, 19],
[19, 71, 0, 19]];


var ctrack = new clm.tracker({ constantVelocity: true, useWebGL: true, scoreThreshold: 0.5, searchWindow: 11, maxIterationsPerAnimFrame: 1, sharpenResponse: false });
// var ctrack = new clm.tracker(pModel);    // default model
ctrack.init(pModel);
ctrack.setResponseMode("cycle", ["lbp", "sobel"]);
delete emotionModel.disgusted;
delete emotionModel.fear;
ec.init(emotionModel);
pModel.shapeModel.nonRegularizedVectors.push(9);
pModel.shapeModel.nonRegularizedVectors.push(11);

function startVideo() {
  document.getElementById("controls").remove();
  ctrack.start(vid);
  trackingStarted = true;
  checkConvergence();
}

function checkConvergence() {
  overlayCC.clearRect(0, 0, vid_width, vid_height);
  pn = ctrack.getConvergence();
  if (pn < 1) {

    RobotVoice.stop();
    window.cancelAnimationFrame(checkConvergence);
    document.getElementById("webgl").addEventListener("click", snapshot);
    hhPart.start();
    //Tone.Transport.scheduleRepeat(triggerHH, "16n");
    // drawGridLoop();
    drawMaskLoop(pos, cp);
  } else {
    pos = ctrack.getCurrentPosition();
    cp = ctrack.getCurrentParameters();
    ctrack.draw(overlay, cp, "vertices");
    var check = requestAnimationFrame(checkConvergence);
  }
}

var maax = 0;
function drawGridLoop() {
  var emotion;
  const startTime = performance.now();
  // get position of face
  cp = ctrack.getCurrentParameters();
  pos = ctrack.getCurrentPosition();
  pn = ctrack.getConvergence();
  var er = ec.meanPredict(cp);
  var opacity = 1 - pn / 9990;
  webgl_overlay.style.opacity = opacity;
  var emotions = [er[0], er[1], er[2], er[3]];
  // check whether mask has converged

  if (er) {
    var angry = er[0].value / 1 * -32;
    var sad = er[1].value / 1 * -32;
    var surprised = er[2].value / 1 * -32;
    var happy = er[3].value / 1 * 23;
    maax = Math.max.apply(Math, er.map(function (o) {return o.value;}));

    for (var i = 0; i < 4; i++) {
      if (er[i].value === maax) {
         emotion = er[i].emotion;
        premotion.push(emotion);
      }
    }
    if (premotion.length > 2) {
      premotion.shift();
    }
    if (premotion[0] != premotion[1]) {
      neon();
      Tone.Transport.schedule(setNewEmo(emotion),"32n");
      //Tone.Transport.schedule(setNewEmo(emotion), "+64n" );
    }
    switch (premotion[1]) {
      case 'angry':
        ph["component 15"] = angry;
        ph["component 3"] = 0;
        ph["component 13"] = 0;
        ph["component 17"] = 0;
        break;
      case 'sad':
        ph["component 13"] = sad;
        ph["component 3"] = 0;
        ph["component 15"] = 0;
        ph["component 17"] = 0;
        break;
      case 'surprised':
        ph["component 3"] = surprised;
        ph["component 13"] = 0;
        ph["component 15"] = 0;
        ph["component 17"] = 0;
        break;
      case 'happy':
        ph["component 17"] = happy;
        ph["component 3"] = 0;
        ph["component 13"] = 0;
        ph["component 15"] = 0;
        break;}

    updateData(er);
  }
  var duration = performance.now() - startTime;
  drawMaskLoop(pos, cp);


}
function drawMaskLoop(pos, parameters) {

  videocanvas.getContext('2d').drawImage(vid, 0, 0, videocanvas.width, videocanvas.height);
  if (pos) {
    // create additional points around face
    var tempPos;
    var addPos = [];
    for (var i = 0; i < 23; i++) {
      tempPos = [];
      tempPos[0] = (pos[i][0] - pos[62][0]) * 1.3 + pos[62][0];
      tempPos[1] = (pos[i][1] - pos[62][1]) * 1.3 + pos[62][1];
      addPos.push(tempPos);
    }
    // merge with pos
    var newPos = pos.concat(addPos);
    var newVertices = pModel.path.vertices.concat(mouth_vertices);
    // merge with newVertices
    newVertices = newVertices.concat(extendVertices);
    fd.load(videocanvas, newPos, pModel, newVertices);
    parameters[6] += ph["component 3"];
    parameters[16] += ph["component 13"];
    parameters[18] += ph["component 15"];
    parameters[20] += ph["component 17"];

    positions = ctrack.calculatePositions(parameters);
    if (positions) {
      // add positions from extended boundary, unmodified
      newPos = positions.concat(addPos);
      // draw mask on top of face
      fd.draw(newPos);
    }
  }
  animationRequest = requestAnimationFrame(drawGridLoop);
}

  function neon() {
  var color;


  if (premotion[1] === "happy") {
    color = '#ffcf00';
    clear = happytxt;
    animation();
  } else {
    clear = happytxt;
    stopanimation();
  }
  if (premotion[1] === "surprised") {
    color = '#ff4d00';
    clear = surprisedtxt;
    animation();
  } else {
    clear = surprisedtxt;
    stopanimation();
  }
  if (premotion[1] === "sad") {
    color = '#0033ff';
    clear = sadtxt;
    animation();
  } else {
    clear = sadtxt;
    stopanimation();
  }
  if (premotion[1] === "angry") {
    color = '#F00033';
    clear = angrytxt;
    animation();
  } else {
    clear = angrytxt;
    stopanimation();
  }
  function animation() {
    clear.style.textShadow = color + " 0px 0px 5px, " + color + " 0px 0px 10px," + color + "  0px 0px 15px," + color + " 0px 0px 20px," + color + " 0px 0px 30px," + color + " 0px 0px 40px," + color + " 0px 0px 50px," + color + " 0px 0px 75px";
    clear.style.transition = " transform .4s";
    clear.style.transform = " rotateY(2deg)";
  }
  function stopanimation() {
    // clear.style.transition= " transform .4s";
    clear.style.textShadow = "";
    clear.style.transform = " rotateY(40deg)";
  }
}





/********** parameter code *********/

var pnums = pModel.shapeModel.eigenValues.length - 2;
var parameterHolder = function () {
  this['component ' + 3] = 0;
  this['component ' + 13] = 0;
  this['component ' + 15] = 0;
  this['component ' + 17] = 0;
  for (var i = 0; i < pnums; i++) {
    this['component ' + (i + 3)] = 0;

  }
};

var ph = new parameterHolder();
var gui = new dat.GUI();
dat.GUI.toggleHide();
var control = {};
var eig = 0;

for (var i = 0; i < pnums; i++) {
  eig = Math.sqrt(pModel.shapeModel.eigenValues[i + 2]) * 3;
  //   //  control['c'+(i+3)] = gui.add(ph, 'component '+(i+3), -5*eig, 5*eig).listen();
}

control['c' + 3] = gui.add(ph, 'component ' + 3, 0, -6 * eig).listen();
control['c' + 13] = gui.add(ph, 'component ' + 13, 0, -5 * eig).listen();
control['c' + 15] = gui.add(ph, 'component ' + 15, 0, -6 * eig).listen();
control['c' + 17] = gui.add(ph, 'component ' + 17, 0, 5 * eig).listen();

// ec.init(emotionModel);
var emotionData = ec.getBlank();

/************ d3 code for barchart *****************/
var margin = { top: 20, right: 40, bottom: 10, left: 40 },
width = 600 - margin.left - margin.right,
height = 250 - margin.top - margin.bottom;
var barWidth = 30;
var formatPercent = d3.format(".0%");

var x = d3.scale.linear().
domain([0, ec.getEmotions().length]).range([margin.left, width + margin.left]);
var y = d3.scale.linear().
domain([0, 1]).range([0, height]);
var svg = d3.select("#emotion_chart").append("svg").
attr("width", width + margin.left + margin.right).
attr("height", height + margin.top + margin.bottom);
svg.selectAll("rect").
data(emotionData).
enter().
append("svg:rect").
attr("x", function (datum, index) {return x(index);}).
attr("y", function (datum) {return height - y(datum.value);}).
attr("height", function (datum) {return y(datum.value);}).
attr("width", barWidth).
attr("fill", function (datum, index) {return colorPicker(x(index));});

function colorPicker(v) {

  if (v < 60) {return "#F00033";} else
  if (v < 300) {return "#0033ff";} else
  if (v < 430) {return "#ff4d00";} else
  if (v < 600) {return "#ffcf00";}}


function updateData(data) {
  // update
  var rects = svg.selectAll("rect").
  data(data).
  attr("y", function (datum) {return height - y(datum.value);}).
  attr("height", function (datum) {return y(datum.value);});
  var texts = svg.selectAll("text.labels").
  data(data).
  attr("y", function (datum) {return height - y(datum.value);}).
  text(function (datum) {return datum.value.toFixed(1);});
  // enter
  rects.enter().append("svg:rect");
  texts.enter().append("svg:text");
  // exit
  rects.exit().remove();
  texts.exit().remove();
}




var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var major = [0, 4, 7, 12, 16, 19, 24, 28, 31];
var majorFirstInversion = [4, 7, 12, 16, 19, 24, 28, 31, 36];
var majorSecondInversion = [7, 12, 16, 19, 24, 28, 31, 36, 40];

var dorico = [0, 3, 5, 7, 9, 10, 12];
var aeolian = [0, 2, 3, 5, 7, 10, 12, 17, 29];
var sus = [0, 5, 7, 12, 17, 19, 24, 29, 31];

var augmented = [0, 3, 8, 12, 15, 20, 24, 27, 32];
var augFirstInversion = [3, 8, 12, 15, 20, 24, 27, 32, 36];
var augSecondInversion = [8, 12, 15, 20, 24, 27, 32, 36, 39];

var diminished = [0, 3, 6, 9, 12, 15, 18, 21, 24];
var dimFirstInversion = [3, 6, 9, 12, 15, 18, 21, 24];
var dimSecondInversion = [6, 9, 12, 15, 18, 21, 24, 27];

var scaleHappy = [major, majorFirstInversion, majorSecondInversion];
var scaleSad = [dorico, aeolian, sus];
var scaleSurprised = [augmented, augFirstInversion, augSecondInversion];
var scaleAngry = [diminished, dimFirstInversion, dimSecondInversion];

var s, a;
let b;
var intervalHappy;
var intervalSad;
var intervalSurprise;
var intervalAngry;

var triadHappy = [0, 4, 7, 10, 12];
var triadSad = [0, 3, 7, 10, 12];
var triadSurprise = [0, 4, 8, 12];
var triadAngry = [0, 3, 6, 9, 12];

var r;
var nota = [48, 50, 52, 53, 55, 57, 59];
let root, not;

var direction = 0;
var arpActive = false;
var bassActive = false;
var playing = false;
var ArpId;
var CallR;
var preRoot;
//////////////////////////////////////////
function callRoot() {
  if (premotion[1] === "happy") {
    r = Math.floor(Math.random() * nota.length);
    not = nota[r];
    var absolute = Math.abs(not - preRoot);
    if (absolute == 1) {
      root = not + 1;
    } else if (absolute == 3) {
      root = not + 1;
    } else if (absolute == 6) {
      root = not + 1;
    } else if (absolute == 8) {
      root = not - 1;
    } else if (absolute == 9) {
      root = not - 2;
    } else if (absolute == 11) {
      root = not + 1;
    } else {
      root = not;
    }
    console.log("  HAPPYROOT  " + root);
  } else {
    r = Math.floor(Math.random() * nota.length);
    not = nota[r];
    root = not;
  }
  //root=not;
  b = root;
  preRoot = root;
  distHHPattern(root);

}

function myCallback(r, not)
{
  r = Math.floor(Math.random() * 7);
  not = nota[r];
  root = not;
  b = root;
  preRoot = root;
  console.log("START ROOT" + root);
}
myCallback();

///////////////////////////////////////////////

var callHappy = new Tone.Loop(function (time) {
  root = b;
  var s = Math.floor(Math.random() * triadHappy.length);
  var a = triadHappy[s];
  root = root + a;
}, "1m");


var callSad = new Tone.Loop(function (time) {
  root = b;
  var s = Math.floor(Math.random() * triadSad.length);
  var a = triadSad[s];
  root = root + a;
}, "1m");

var callSurprise = new Tone.Loop(function (time) {
  root = b;
  var s = Math.floor(Math.random() * triadSurprise.length);
  var a = triadSurprise[s];
  root = root + a;
}, "1m");

var callAngry = new Tone.Loop(function (time) {
  root = b;
  var s = Math.floor(Math.random() * triadAngry.length);
  var a = triadAngry[s];
  root = root + a;
}, "1m");


////////////////////////////////////////////

Tone.Transport.bpm.value = 100;
ToggleTransport = function () {

  Tone.Transport.start("+0.1");
  Tone.context.latencyHint = 'fastest';
  Tone.context.lookAhead = 0.1;
  drop.start(0);
  kickPart.start("+1m");
  RobotVoice.start("+16n");
  distHH.start("+1m");
  CallR = Tone.Transport.scheduleRepeat(callRoot, "4m");
};


midiToFreq = function (m) {
  return 440 * Math.pow(2, (m - 69) / 12.0);
};

function setNewEmo(emotion) {
  if (emotion !== null) {
    arpActive = true;
    bassActive = true;
  }


 

    Tone.Transport.clear(CallR);
    CallR = Tone.Transport.scheduleRepeat(callRoot, "4m");
    Tone.Transport.clear(ArpId);
    direction = Math.floor(Math.random() * 2);

    switch (emotion) {
      case 'happy':
        s = Math.floor(Math.random() * 3);
        scale = scaleHappy[s];

        callSad.stop();
        callSurprise.stop();
        callAngry.stop();
        callHappy.start();


        ArpId = Tone.Transport.scheduleRepeat(triggerArp, "16n");
        arp.set({
          harmonicity: 8,
          modulationIndex: 2,
          oscillator: {
            type: "sine" },

          envelope: {
            attack: 0.001,
            decay: 2,
            sustain: 0.1,
            release: 2 },

          modulation: {
            type: "square" },

          modulationEnvelope: {
            attack: 0.002,
            decay: 0.2,
            sustain: 0,
            release: 0.2 },

          portamento: 0 });


        kickPart.playbackRate = 1;
        bitcrusher.wet.linearRampToValueAtTime(0, "+1m");
        hhNote = [null];
        hhPattern(hhNote);
        distHH.playbackRate = 0.5;
        filterAngryHH.frequency.linearRampToValueAtTime(1000, "+1m");
        break;


      case 'sad':
        direction = 1;
        s = Math.floor(Math.random() * 3);
        scale = scaleSad[s];
        callHappy.stop();
        callSurprise.stop();
        callAngry.stop();

        ArpId = Tone.Transport.scheduleRepeat(triggerArp, "4n");
        arp.set({
          harmonicity: 3,
          modulationIndex: 10,
          detune: 0,
          oscillator: {
            type: "sine" },

          envelope: {
            attack: 0.01,
            decay: 0.01,
            sustain: 1,
            release: 0.5 },

          modulation: {
            type: "square" },

          modulationEnvelope: {
            attack: 0.5,
            decay: 0,
            sustain: 1,
            release: 0.5 },

          portamento: 0.09 });


        kickPart.playbackRate = 0;
        bitcrusher.wet.linearRampToValueAtTime(0, "+1m");
        hhNote = ["C2", null, null, null,
        "C2", null, null, null,
        "C2", null, null, null,
        "C2", null, null, null];
        hhPattern(hhNote);
        noiseSynth.envelope.decay = 1;
        noiseSynth.envelope.release = 1;
        distHH.playbackRate = 0;
        filterAngryHH.frequency.linearRampToValueAtTime(10, "+1m");
        break;


      case 'surprised':
        s = Math.floor(Math.random() * 3);
        scale = scaleSurprised[s];

        callHappy.stop();
        callSad.stop();
        callAngry.stop();
        callSurprise.start();

        ArpId = Tone.Transport.scheduleRepeat(triggerArp, "32n");
        arp.set({
          harmonicity: 3,
          modulationIndex: 10,
          detune: 0,
          oscillator: {
            type: "sine" },

          envelope: {
            attack: 0.01,
            decay: 0.01,
            sustain: 1,
            release: 0.5 },

          modulation: {
            type: "square" },

          modulationEnvelope: {
            attack: 0.5,
            decay: 0,
            sustain: 1,
            release: 0.5 },

          portamento: 0 });


        kickPart.playbackRate = 0;
        bitcrusher.wet.linearRampToValueAtTime(0, "+1m", "+16n");
        hhNote = [null];//[["A#1", "A#1", "A#1", "A#1"], "A#1",
                 //["A#1", "A#1", "A#1", "A#1"], "A#1",
                 //["A#1", "A#1", "A#1", "A#1"], "A#1",
                 // "A#1", "A#1", "A#1", "A#1", "A#1", "A#1", "A#1"];
        hhPattern(hhNote);
        noiseSynth.envelope.decay = 0.11;
        noiseSynth.envelope.release = 1;
        distHH.playbackRate = 1;
        filterAngryHH.frequency.linearRampToValueAtTime(20000, "+1m");
        break;


      case 'angry':
        s = Math.floor(Math.random() * 3);

        scale = scaleAngry[s];
        callHappy.stop();
        callSad.stop();
        callSurprise.stop();
        callAngry.start();

        ArpId = Tone.Transport.scheduleRepeat(triggerArp, "4n");
        arp.set({
          harmonicity: 1,
          modulationIndex: 1.2,
          oscillator: {
            type: "fmsawtooth",
            modulationType: "sine",
            modulationIndex: 20,
            harmonicity: 3 },

          envelope: {
            attack: 0.05,
            decay: 0.3,
            sustain: 1,
            release: 1.2 },

          modulation: {
            volume: 0,
            type: "triangle" },

          modulationEnvelope: {
            attack: 0.35,
            decay: 0.1,
            sustain: 1,
            release: 0.01 },

          portamento: 0 });


        kickPart.playbackRate = 1;
        bitcrusher.wet.value = 0.4;

        hhNote = [["A#1", "A#1", "A#1", "A#1"], "C2", "C2", "C2",
        null, "A#1", "C2", "C2",
        null, "A#1", "C2", "C2",
        null, "A#1", "C2", "C2"];
        hhPattern(hhNote);
        noiseSynth.envelope.decay = 0.04;
        noiseSynth.envelope.release = 0.0011;
        distHH.playbackRate = 1;
        filterAngryHH.frequency.linearRampToValueAtTime(0, "+1m");
        break;}  
}

var drop = new Tone.GrainPlayer("https://s3-us-west-2.amazonaws.com/s.cdpn.io/6859/open-bubble-2.mp3",
function () {
  drop.loop = false;
  drop.playbackRate = 0.9;
  drop.volume.value = -5;
}).toMaster();

var RobotVoice = new Tone.GrainPlayer("https://actam.s3.us-east-2.amazonaws.com/141+to+160+bpm/RobotVoice.wav", function () {
  RobotVoice.loop = true;
  RobotVoice.playbackRate = 0.9;
  RobotVoice.volume.value = -5;
}).toMaster();

var noiseSynth = new Tone.NoiseSynth({
  envelope: {
    attack: 0.001,
    decay: 0.04,
    sustain: 0.01,
    release: 0.0011 } });


noiseSynth.volume.value = -25;

var AngryHH = new Tone.PluckSynth();

var kick = new Tone.MembraneSynth({
  "envelope": {
    "attack": 0.05,
    "decay": 0.8,
    "sustain": 0.1 } }).

toMaster();
kick.volume.value = -10;

var arp = new Tone.FMSynth();
arp.volume.value = -13;

var step = 0;
var arpStep = 0;
function triggerArp(time) {
  if (arpActive) {
    var n = midiToFreq(root + scale[arpStep % scale.length]);
    arp.triggerAttackRelease(n,arp.toSeconds("8n") , time, Math.random()); //arp.toSeconds('16n')

  }
  switch (direction) {
    case 0:
      arpStep++;
      break;
    case 1:
      arpStep--;
      break;}


  if (arpStep >= 200 * scale.length) {
    arpStep = 0;
  } else if (arpStep < 0) {
    arpStep = 200 * scale.length;
  }
}


var kickPart = new Tone.Sequence(function (time, note) {
  kick.triggerAttackRelease(note, "4n", time);
}, ['C1', 'E1', 'E1', 'B0'], "4n");

var hhNote = ["A#1", "C2", "C2", "C2", "A#1", "C2", "C2", "C2"];
var hhVel = 1; //Math.random();
var hhPart = new Tone.Sequence(function (time, note) {
  hhVel = Math.random();
  HHpanner.pan.value = Math.random() * 2 - 1;
  //hhPart.events = hhNote
  noiseSynth.triggerAttackRelease("32n", time, hhVel);
}, hhNote, "16n");

function hhPattern(pattern) {
  hhPart.removeAll();
  for (i = 0; i <= pattern.length; i++) {
    hhPart.at(i, pattern[i]);
  }
}

var distHH = new Tone.Sequence(function (time, note) {
  Angrypanner.pan.value = Math.random() * 2 - 1;
  AngryHH.volume.value = -10; //-(Math.random()*10+10);
  AngryHH.triggerAttack(note, time);
}, ["A1", "C2", "C2", "C2", null], "16n");

function distHHPattern(root) {
  var k = midiToFreq(root - 12);
  var k_12 = midiToFreq(root - 24);
  distHH.removeAll();
  distHH.at(0, k_12);
  distHH.at(1, k);
  distHH.at(2, k);
  distHH.at(3, k);
  distHH.at(4, null);
}
/**********EFFECTS***********/
var pingPong = new Tone.PingPongDelay('8n');
pingPong.feedback.value = 0.8;

var Chorus = new Tone.Chorus(1).toMaster();
arp.chain(Chorus);
Chorus.connect(pingPong);

arpFilter = new Tone.Filter().toMaster();
pingPong.connect(arpFilter);
arpFilter.frequency.value = 1500;


var Sadnessdelay = new Tone.FeedbackDelay("8n", 0.25);
Sadnessdelay.wet.value = 1;

kick.chain(Tone.Master);

var bitcrusher = new Tone.BitCrusher();
bitcrusher.wet.value = 0;
kick.chain(bitcrusher, Tone.Master);

var reverb = new Tone.Freeverb({
  roomSize: 0.9,
  dampening: 8000 });

reverb.wet.value = 0.06;

var filterHH = new Tone.Filter({
  type: 'highpass',
  frequency: 450,
  rolloff: -12,
  Q: 4,
  gain: 0 });

var HHpanner = new Tone.Panner();
var HHlfo = new Tone.LFO(0.6, 100, 10000);
HHlfo.connect(filterHH.frequency);
HHlfo.start();
noiseSynth.chain(filterHH, HHpanner, reverb, Tone.Master);


var filterAngryHH = new Tone.Filter({
  type: 'highpass',
  frequency: 100,
  rolloff: -12,
  Q: 4,
  gain: 0 });

var Angrypanner = new Tone.Panner();
AngryHH.chain(Angrypanner, filterAngryHH, Sadnessdelay, Tone.Master);


//****** SNAPSHOT ************************//
function snapshot() {

  cancelAnimationFrame(animationRequest);
  document.getElementById("content").remove();
 
  ctrack.stop();

  w = photoCanvas.width = videocanvas.width;
  h = photoCanvas.height = videocanvas.height;
  photoCanvas.getContext('2d').drawImage(vid, 0, 0, photoCanvas.width, photoCanvas.height);
  ctx = photoCanvas.getContext('2d');
  ctx.translate(w, h);
  ctx.rotate(180 * Math.PI / 180);
  frame = ctx.getImageData(0, 0, w, h);
  ctx.clearRect(0, 0, w, h);

  vid.srcObject.getTracks()[0].stop();


  Tone.Transport.stop();
  Tone.Transport.cancel();
  Tone.Transport.clear(ArpId);
  Tone.Transport.clear(CallR);
  callHappy.dispose();
  callSad.dispose();
  callSurprise.dispose();
  callAngry.dispose();
  hhPart.dispose();
  distHH.dispose();
  kickPart.dispose();

  arp.dispose();
  RobotVoice.dispose();
  noiseSynth.dispose();
  AngryHH.dispose();
  Angrypanner.dispose();
  filterAngryHH.dispose();
  HHlfo.dispose();
  HHpanner.dispose();
  bitcrusher.dispose();
  reverb.dispose();
  pingPong.dispose();
  Chorus.dispose();
  arpFilter.dispose();
  Sadnessdelay.dispose();

  setTimeout(phasetwo, 10);
  // return phasetwo();
}

//https://cdnjs.cloudflare.com/ajax/libs/tone/13.2.0/Tone.min.js
//https://unpkg.com/tone


//**************************************************************************//
//*************************** PHASE 2 **************************************//
//**************************************************************************//


//******SPECTRO SOUNDS******////
var gainS = new Tone.Gain();
var ACTX = gainS.context;
const ANALYSER = ACTX.createAnalyser();
ANALYSER.fftSize = 4096;
ANALYSER.smoothingTimeConstant = 0;
ANALYSER.windowing = 0;
ANALYSER.Tail = 0;

var delay = new Tone.FeedbackDelay("8n", 0.9).toMaster();

var SpectroSynth = new Tone.PolySynth(410, Tone.Synth, {}).connect(gainS);
var SpectroSynth2 = new Tone.PolySynth(410, Tone.Synth, {}).connect(gainS);
var SpectroSynth3 = new Tone.PolySynth(410, Tone.Synth, {}).connect(gainS);
var SpectroSynth4 = new Tone.PolySynth(410, Tone.Synth, {}).connect(gainS);

SpectroSynth.toMaster();
SpectroSynth2.toMaster();
SpectroSynth3.toMaster();
SpectroSynth4.toMaster();
gainS.connect(delay);


SpectroSynth.set({
  volume: -20,
  oscillator: {
    type: "sine",
    partials: [0.6, 0, 0],
    partialCount: 0 },


  envelope: {
    attack: 0.001,
    decay: 0.07,
    sustain: 0.001,
    release: 0.00011,
    attackCurve: "linear",
    decayCurve: "linear" },

  portamento: 0 });


SpectroSynth2.set({

  oscillator: {
    type: "sine",
    partials: [0.6, 0, 0],
    partialCount: 0 },

  volume: -20,
  envelope: {
    attack: 0.001,
    decay: 0.07,
    sustain: 0.001,
    release: 0.00011,
    attackCurve: "linear",
    decayCurve: "linear" },

  portamento: 0 });

SpectroSynth3.set({
  volume: -20,
  oscillator: {
    type: "sine",
    partials: [0.6, 0, 0],
    partialCount: 0 },


  envelope: {
    attack: 0.001,
    decay: 0.07,
    sustain: 0.001,
    release: 0.00011,
    attackCurve: "linear",
    decayCurve: "linear" },

  portamento: 0 });

SpectroSynth4.set({
  volume: -20,
  oscillator: {
    type: "sine",
    partials: [0.6, 0, 0],
    partialCount: 0 },


  envelope: {
    attack: 0.001,
    decay: 0.07,
    sustain: 0.001,
    release: 0.00011,
    attackCurve: "linear",
    decayCurve: "linear" },

  portamento: 0 });



//***** Edge detection 
function edge() {
  bw = frame;
  // black-white
  // var data = bw.data;
  // Loop through the pixels, turning them grayscale

  for (var i = 0; i <= bw.data.length; i += 4) {
    var r = bw.data[i];
    var g = bw.data[i + 1];
    var b = bw.data[i + 2];
    var brightness = (2 * r + g + 3 * b) / 3; //different colors weight
    bw.data[i] = brightness;
    bw.data[i + 1] = brightness;
    bw.data[i + 2] = brightness;
  }
  for (var l = 0; l <= w; l++) {
    for (var j = 0; j <= h; j++) {
      // Pixel location and color
      var k = (l + j * w) * 4;
      var pix = bw.data[k + 2];
      var left = bw.data[k - 4];
      var right = bw.data[k + 4];
      var top = bw.data[k - w * 4];
      var bottom = bw.data[k + w * 4];

      var t = 10;

      if (pix > left + t) {
        paint(l, j);
      } else
      if (pix < left - t) {
        paint(l, j);
      } else
      if (pix > right + t) {
        paint(l, j);
      } else
      if (pix < right - t) {
        paint(l, j);
      } else
      if (pix > top + t) {
        paint(l, j);
      } else
      if (pix < top - t) {
        paint(l, j);
      } else
      if (pix > bottom + t) {
        paint(l, j);
      } else
      if (pix < bottom - t) {
        paint(l, j);
      }
    }
  }

  img = ctx.getImageData(0, 0, w, h);
  // document.getElementById("photoCanvas").remove();         
  // ctx.clearRect(0,0,w,h)
  return mapping();
}
//***** Drawing the edges*********//

function paint(i, j) {
  ctx.beginPath();
  ctx.arc(i, j, 0.19, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#FFF';
  ctx.fill();
}

//***** Click Spectrogram ********//
function phasetwo(){ 
     edge();    
       if ( btnBool === true){
     
       	    StS.value = "start";
						StS.disabled = null;
              document.getElementById("StS").addEventListener("click",spectrogram);
       }
      // StS.onclick = function(){
      // phase2.remove();
      //return spectrogram();     
  
} 





var s = 0; // counter
var spectroLello; // requestAnimationFrame

//********  MAPPING 2D ARRAY  **********/////
function mapping() {
  for (let i = 0; i <= w; i++) {
    for (let j = 0; j <= h; j++) {
      var k = (i + j * w) * 4 + 4; //i*w + j
      if (img.data[k] > 254) {

        let tnv = {};

        tnv["time"] = i / 9;
        tnv["note"] = j / h * 19980 + 20;
        tnv["velocity"] = img.data[k + 3] / 255;

        if (j >= 376 && j <= 500) {
          note.push(tnv);
        } else if (j >= 251 && j <= 375) {
          note2.push(tnv);
        } else if (j >= 126 && j <= 250) {
          note3.push(tnv);
        } else if (j <= 125) {
          note4.push(tnv);
        }
      }
    }
    if (i == w) {
      spectropart();
    }
  }
  return btnBool = true;
}

function spectropart() {
  var SpectroPart = new Tone.Part(function (time, value) {
    SpectroSynth.triggerAttackRelease(value.note, "192i", time, value.velocity);
  }, note).start(0); //[{"time" : 0, "note" : "C3", "velocity": 0.9},{"time" : "0:2", "note" : "C4", "velocity": 0.5}]
  var SpectroPart2 = new Tone.Part(function (time, value) {
    SpectroSynth2.triggerAttackRelease(value.note, "192i", time, value.velocity);
  }, note2).start(0);
  var SpectroPart3 = new Tone.Part(function (time, value) {
    SpectroSynth2.triggerAttackRelease(value.note, "192i", time, value.velocity);
  }, note3).start(0);
  var SpectroPart4 = new Tone.Part(function (time, value) {
    SpectroSynth4.triggerAttackRelease(value.note, "192i", time, value.velocity);
  }, note4).start(0);

}
//***** Synth Part  + Spectrogram inizialization

function spectrogram() {

 phase2.remove();
  const W = CVS.width = window.innerWidth; //width photo 678px;
  const H = CVS.height = 500; //window.innerHeight; //height photo 500px;
  gainS.connect(ANALYSER);
  var bufferLength = ANALYSER.frequencyBinCount;
  const DATA = new Uint8Array(bufferLength);
  const LEN = DATA.length;

  const he = H / LEN; //height of each value 1/4096
  const x = W - 1; //where it starts drawing   

  CTX.fillStyle = 'hsl(280, 100%, 0%)';
  CTX.fillRect(0, 0, W, H);

  //***** Visual loop *********////
  spectroLoop();

  function spectroLoop() {
    spectroLello = requestAnimationFrame(spectroLoop);
    let sData = CTX.getImageData(3 * W / 4, 0, W / 4 - 1, H);
    let imgData = CTX.getImageData(1, 0, 3 / 4 * W - 1, H);
    CTX.fillRect(0, 0, W, H);
    CTX.putImageData(imgData, 0, 0);
    CTX.putImageData(sData, 0, 0);
    ANALYSER.getByteFrequencyData(DATA);
    for (let i = 0; i < LEN; i++) {
      let rat = DATA[i] / 255; //loudness
      let hue = Math.round(rat * 180 + 320 % 127); //360
      let sat = '100%';
      let lit = 70 * rat + '%';
      CTX.beginPath();
      CTX.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
      CTX.moveTo(x - W / 4, H - i * he); // (i * h)) reverse height
      CTX.lineTo(x, H - (i * he + he));
      CTX.stroke();
    }
  }
  Tone.Transport.bpm.value = 97.50;
  Tone.Transport.start();
  // StartAudioContext(Tone.context, document.documentElement);
  Tone.context.latencyHint = 'fastest';
  Tone.context.lookAhead = 0;
  Tone.Transport.nextSubdivision(30); //PPQ at 64i (60000/BPM*ppq) = 0.00320//object timinig ( 0.076923);//bpm (97.50)     
  drop.start();
  //  Tone.Transport.PPQ = 224; 
}