//****** SPECTRO stuff **************//         
        
        var w = 668, h = 500;
        var img,video,frame,bw,ctx;   
        var btnBool = false;
        var StS = document.getElementById("StS");
        const CVS = document.body.querySelector('#spectrogram');
        const CTX = CVS.getContext('2d');

//***** Object + arrays for SPECTRO frequency

        var tnv   = {};
        var note  = [];
        var note2 = [];
        var note3 = [];
        var note4 = [];
        var note5 = [];
        var note6 = [];
        var note7 = [];
        var note8 = [];
        var note8 = [];
        var note9 = [];

//******SPECTRO SOUNDS******////
     
        var gainS = new Tone.Gain().toMaster(); 
        var ACTX = gainS.context;
        const ANALYSER = ACTX.createAnalyser();
        ANALYSER.fftSize = 4096;
        ANALYSER.smoothingTimeConstant = 0;
        ANALYSER.windowing = 0
        ANALYSER.Tail = 0;
 
  const audio = document.querySelector('audio');
  const actx  = Tone.context;
  const dest  = actx.createMediaStreamDestination();
  const recorder = new MediaRecorder(dest.stream);
  const mixIn = actx.createGain();
  const audioOut = actx.createMediaElementSource(audio);
  gainS.connect(dest);
  audioOut.connect(mixIn);
  const chunks = [];

  recorder.ondataavailable = evt => chunks.push(evt.data);
  recorder.onstop = evt => {
    let blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    audio.src = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href =  audio.src;
  a.download = 'SpectroID.webm';
  a.click();

  };

        var delay= new Tone.FeedbackDelay("8n",0.9).toMaster();

        var  SpectroSynth = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
        var SpectroSynth2 = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
        var SpectroSynth3 = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
        var SpectroSynth4 = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
        var SpectroSynth5 = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
        var SpectroSynth6 = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
        var SpectroSynth7 = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
        var SpectroSynth8 = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
        var SpectroSynth9 = new Tone.PolySynth(500,Tone.Synth, {}).connect(gainS);
      

        gainS.connect(delay);


     SpectroSynth.set({
             volume: -20,
             oscillator: {
             type: "sine",
             partials: [1,0,0],
             partialCount:1
             },
       
             envelope: {
             attack: 0.1,
             decay: 0.2,
             sustain: 0.1,
             release: 0.011,
          
             },
       
       
        });
       SpectroSynth2.set({

             oscillator: {
             type: "sine",
             partials: [0.6,0,0],
             partialCount:1
              },
             volume: -20,
             envelope: {
             attack: 0.1,
             decay: 0.2,
             sustain: 0.1,
             release: 0.011,
            
             },
         
      });
      SpectroSynth3.set({
             volume: -20,
             oscillator: {
             type: "sine",
             partials: [0.6,0,0],
             partialCount:1
              },
            envelope: {
             attack: 0.1,
             decay: 0.2,
             sustain: 0.1,
             release: 0.011,
          
             },
        
      }); 
        SpectroSynth4.set({
             volume: -20,
             oscillator: {
             type: "sine",
             partials: [0.6,0,0],
             partialCount:1
              },

              envelope: {
             attack: 0.1,
             decay: 0.2,
             sustain: 0.1,
             release: 0.011,
          
             },
        
      }); 
         SpectroSynth5.set({
             volume: -20,
             oscillator: {
             type: "sine",
             partials: [0.6,0,0],
             partialCount:1
              },

              envelope: {
             attack: 0.1,
             decay: 0.2,
             sustain: 0.1,
             release: 0.011,
          
             },
         
       }); 
          SpectroSynth6.set({
                      volume: -20,
                      oscillator: {
                      type: "sine",
                      partials: [0.6,0,0],
                      partialCount:1
                       },
         
                      envelope: {
                      attack: 0.01,
                      decay: 0.2,
                      sustain: 0.1,
                      release: 0.011,
                
                      },
                 
               }); 
              SpectroSynth7.set({
                      volume: -20,
                      oscillator: {
                      type: "sine",
                      partials: [0.6,0,0],
                      partialCount:1
                       },
         
                    envelope: {
                    attack: 0.1,
                    decay: 0.2,
                    sustain: 0.1,
                    release: 0.011,
                 
                    },
                  
               }); 
                  SpectroSynth8.set({
                      volume: -20,
                      oscillator: {
                      type: "sine",
                      partials: [0.6,0,0],
                      partialCount:1
                       },
         
                      envelope: {
                      attack: 0.01,
                      decay: 0.2,
                      sustain: 0.1,
                      release: 0.011,
                
                      },
                   
               }); 
          SpectroSynth9.set({
                      volume: -20,
                      oscillator: {
                      type: "sine",
                      partials: [0.6,0,0],
                      partialCount:1
                       },
         
                      envelope: {
                      attack: 0.01,
                      decay: 0.2,
                      sustain: 0.1,
                      release: 0.011,
                
                      },
                   
               }); 
          
 
  //***** Edge detection 
        
function edge() {        
        bw = frame;
        // black-white
        // Loop through the pixels, turning them grayscale

        for (var p = 0; p <= bw.data.length; p += 4) {
        var r = bw.data[p];
        var g = bw.data[p + 1];
        var b = bw.data[p + 2];
        var brightness = (2 * r + g + 3 * b) / 3; //different colors weight
        bw.data[p] = brightness;
        bw.data[p + 1] = brightness;
        bw.data[p + 2] = brightness;
        }
      for (var i = 0; i <= w; i++) {
      for (var j = 0; j <= h; j++) {
         // Pixel location and color
         var k = (i + j * w) * 4;
         var pix = bw.data[k + 2];
         var left = bw.data[k - 4];
         var right = bw.data[k + 4];
         var top = bw.data[k - w * 4];
         var bottom = bw.data[k + w * 4];

         var t = 15;

      if (pix > left + t) {
         paint(i, j);
      } else
      if (pix < left - t) {
        paint(i, j);
      } else
      if (pix > right + t) {
        paint(i, j);
      } else
      if (pix < right - t) {
        paint(i, j);
      } else
      if (pix > top + t) {
        paint(i, j);
      } else
      if (pix < top - t) {
        paint(i, j);
      } else
      if (pix > bottom + t) {
        paint(i, j);
      } else
      if (pix < bottom - t) {
        paint(i, j);
      }
    }
  }
     
       img = ctx.getImageData(0, 0, w, h);
       Image = new Image();
   var canvas = document.getElementById('photoCanvas');
       Image.src = canvas.toDataURL();    
       ctx.clearRect(0,0,w,h);
        
   var myCanvas =         document.getElementById('photoCanvas');
   var ctz = myCanvas.getContext('2d');

          var Obj = Image;
      Obj.onload = function() {
      ctz.drawImage(Image, 0, 0);
      };        
    return mapping();
  }
//***** Drawing the edges*********//

      function paint(i, j) {
      ctx.beginPath();
      ctx.arc(i, j, 0.2, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#FFF';
      ctx.fill();
  }

//***** Click Spectrogram ********//

  function phasetwo(){ 
     edge();    
       if ( btnBool === true){
     
       	    StS.value = "start";
						StS.disabled = null;
       }
       StS.onclick = function(){
       phase2.remove();
      
    
      return spectrogram();     
  } 
} 
 

 var  timelengths
 var notelengths
  var s = 0;        // counter
   var spectroLello; // requestAnimationFrame
    var maxNoteLengths;

//********  MAPPING 2D ARRAY  **********/////
  
function mapping() {
    for (let i = 0; i <= w; i++) {
      for (let j = 0; j <= h; j++) {
        var k = (i + j * w) * 4 + 4; //i*w + j
        if (img.data[k] > 254) {
        
        let tnv = {};
       
        tnv["time"] = i*0.11;
        tnv["note"] =  (j / h) * 19980 + 20;
        tnv["velocity"] =img.data[k+3] / 255;
          
         if(j>=400 && j<= 450){
         note9.push(tnv);  
         }
          else if(j>=350 && j<= 399){
         note8.push(tnv);
        } else if(j>=300 && j<= 349){
         note7.push(tnv);
        } else if(j >250 && j<= 299){   
         note6.push(tnv);
        } else if(j>=200 && j<= 249){
         note5.push(tnv);
        } else if(j>=150 && j<= 199){
         note4.push(tnv);
        }else if(j>=100 && j<= 149){
         note3.push(tnv);
        }else if(j>=50 && j<= 99){
         note2.push(tnv);
        }else if(j>=0 && j<= 49){
         note.push(tnv);
        }
 
     }
    } 
     if(i == w){
        notelengths = [note.length,note2.length,note3.length,note4.length,note5.length,note6.length,note7.length,note8.length,note9.length]
       timelengths = [note[note.length-1].time,note2[note2.length-1].time,note3[note3.length-1].time,note4[note4.length-1].time,note5[note5.length-1].time,note6[note6.length-1].time,note7[note7.length-1].time,note8[note8.length-1].time,note9[note9.length-1].time]
        maxNoteLengths = Math.max.apply(Math,timelengths);
      
        spectropart() ;
     }
   }
 return  btnBool = true;
  }
  var SpectroPart;
  var count = 0;
function spectropart(){
 var SpectroPart = new Tone.Part(function (time, value) { 
 
 SpectroSynth.triggerAttackRelease(value.note, "64i", time, value.velocity);
  }, note).start(0);  
 var SpectroPart2 = new Tone.Part(function (time, value) { 
 
 SpectroSynth2.triggerAttackRelease(value.note, "64i", time, value.velocity);
  }, note2).start(0);
  var SpectroPart3 = new Tone.Part(function (time, value) { 
 
  SpectroSynth3.triggerAttackRelease(value.note, "64i", time, value.velocity);
   }, note3).start(0);
  var SpectroPart4 = new Tone.Part(function (time, value) { 
 
  SpectroSynth4.triggerAttackRelease(value.note, "64i", time, value.velocity);
   }, note4).start(0);
  var SpectroPart5 = new Tone.Part(function (time, value) { 
 
  SpectroSynth5.triggerAttackRelease(value.note, "64i", time, value.velocity);
   }, note5).start(0);
  var SpectroPart6 = new Tone.Part(function (time, value) { 
  
  SpectroSynth6.triggerAttackRelease(value.note, "64i", time, value.velocity);
   }, note6).start(0);
  var SpectroPart7 = new Tone.Part(function (time, value) { 
   
  SpectroSynth7.triggerAttackRelease(value.note, "64i", time, value.velocity);
   }, note7).start(0);
  var SpectroPart8 = new Tone.Part(function (time, value) { 
   
  SpectroSynth8.triggerAttackRelease(value.note, "64i", time, value.velocity);
   }, note8).start(0);
  
    
}
//***** Synth Part  + Spectrogram inizialization

    function spectrogram() {
     
     
      const W = CVS.width = window.innerWidth;  //width photo 678px;
      const H = CVS.height = window.innerHeight-100; //height photo 500px;
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

      function  spectroLoop() {
       Timer = Tone.Transport.seconds;
       if( Timer>maxNoteLengths && recorder.state === "recording"){
        let promise = Promise.resolve(recorded());
      }
     
      spectroLello = requestAnimationFrame(spectroLoop);
      let sData = CTX.getImageData(3 * W / 4, 0, W / 4 - 1, H);
      let imgData = CTX.getImageData(1, 0, 3 / 4 * W - 1, H);
      CTX.fillRect(0, 0, W, H);
      CTX.putImageData(imgData, 0, 0);
      CTX.putImageData(sData, 0, 0);
      ANALYSER.getByteFrequencyData(DATA);
      for (let i = 0; i < LEN; i++) {
      let rat = DATA[i] / 255; //loudness
      let hue = Math.round(rat * 180 + 280 % 360);  //360
      let sat = '100%';
      let lit = 70 * rat + '%';
      CTX.beginPath();
      CTX.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
      CTX.moveTo(x - W / 4, H - i * he); // (i * h)) reverse height
      CTX.lineTo(x, H - (i * he + he));
      CTX.stroke(); 
    }          
  }
    Tone.Transport.bpm.value = 85.22;
      Tone.Transport.start();
      Tone.Transport.nextSubdivision(0.044);
      drop.start();  
      recorder.start()
     
}

var Timer ;
function recorded(){
        audio.style.opacity = 1;
        recorder.stop();
        mixIn.connect(ANALYSER); 
        mixIn.toMaster();  
}