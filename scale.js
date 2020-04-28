var scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28, 31, 33, 36];
var major = [0, 4, 7, 12, 16, 19, 24, 28, 31];
var majorFirstInversion = [4, 7, 12, 16, 19, 24, 28, 31, 36];
var majorSecondInversion = [7, 12, 16, 19, 24, 28, 31, 36, 40];

var dorico = [0, 3, 5, 7, 9, 10, 12];
var aeolian = [0, 2, 3, 5,  7, 10, 12, 17, 29];
var sus = [0, 5, 7, 12, 17, 19, 24, 29, 31];

var augmented = [0, 3, 8, 12, 15, 20, 24, 27,32];
var augFirstInversion = [3, 8, 12, 15, 20, 24, 27, 32, 36];
var augSecondInversion = [8, 12, 15, 20, 24, 27, 32, 36, 39];

var diminished = [0, 3, 6, 9, 12, 15, 18, 21, 24];
var dimFirstInversion = [3, 6, 9, 12, 15, 18, 21, 24];
var dimSecondInversion = [6, 9, 12, 15, 18, 21, 24, 27];

var scaleHappy = [major,majorFirstInversion,majorSecondInversion];
var scaleSad = [dorico,aeolian,sus];
var scaleSurprised = [augmented,augFirstInversion,augSecondInversion];
var scaleAngry = [diminished,dimFirstInversion,dimSecondInversion];

var s,a;
let b;
var intervalHappy;
var intervalSad;
var intervalSurprise;
var intervalAngry;

var triadHappy = [0, 4 ,7 ,10 ,12];
var triadSad = [0, 3, 7, 10, 12];
var triadSurprise = [0, 4, 8, 12];
var triadAngry = [0, 3, 6, 9, 12]; 

var r;
var nota= [48,50,52,53,55,57,59];
let root,not;

var direction = 0;
var arpActive = false;
var bassActive = false;
var playing = false;
var ArpId
var CallR
var preRoot ;
//////////////////////////////////////////
 function callRoot(){ 
  if (premotion[1] === "happy"){
  r= Math.floor(Math.random() * nota.length);   
  not=nota[r];
  var absolute = Math.abs(not-preRoot);
   if (absolute==1){
   root = not + 1;
    }else if (absolute == 3){ 
   root = not + 1;
   }else if (absolute == 6){  
   root = not + 1;
   }else if (absolute == 8){
   root = not - 1;
   }else if (absolute == 9){
   root = not - 2;
   }else if (absolute == 11){
   root = not + 1; 
   }else {
   root = not;
   }   
      
  }else{ 
  r= Math.floor(Math.random() * nota.length);   
  not=nota[r];
  root=not;
  }
  
  b=root;
  preRoot = root;
  distHHPattern(root);
 
}

function myCallback(r, not)
{
 r= Math.floor(Math.random() * 7);
  not=nota[r]
  root=not;
  b=root;
  preRoot = root
 
}
 

///////////////////////////////////////////////

var callHappy = new Tone.Loop(function(time){
      root = b;
      var   s= Math.floor(Math.random() * triadHappy.length);
      var   a= triadHappy[s]
      root= root + a;
}, "1m");


var callSad = new Tone.Loop(function(time){
       root = b;
       var   s= Math.floor(Math.random() * triadSad.length);
       var   a= triadSad[s];
       root= root + a;
}, "1m");

var callSurprise = new Tone.Loop(function(time){
    root = b;
       var   s= Math.floor(Math.random() * triadSurprise.length);
      var  a= triadSurprise[s]
        root= root + a;
}, "1m");

var callAngry = new Tone.Loop(function(time){
    root = b;
      var  s= Math.floor(Math.random() * triadAngry.length);
      var   a= triadAngry[s]
        root= root + a;
}, "1m");


////////////////////////////////////////////

    Tone.Transport.bpm.value = 100;   
    ToggleTransport = function() { 
      
    Tone.Transport.start("+0.1"); 
    Tone.context.latencyHint = 'fastest';
    Tone.context.lookAhead = 0.1;
    drop.start(0);
    kickPart.start("+1m");
    RobotVoice.start("+16n");  
    distHH.start("+1m");
    CallR =  Tone.Transport.scheduleRepeat(callRoot, "4m"); 
    }


  midiToFreq = function (m) {
  return 440 * Math.pow(2, (m - 69) / 12.0);
};
 var snap = false;
 function setNewEmo(emotion) {
      if (emotion !== null) {
        arpActive = true;
        bassActive = true;   
      }

   
  if (snap === false){
    
      Tone.Transport.clear(CallR);
      CallR = Tone.Transport.scheduleRepeat(callRoot, "4m");
      Tone.Transport.clear(ArpId);
      direction = Math.floor(Math.random() * 2);

  switch (emotion) {
  case 'happy':
      s= Math.floor(Math.random() * 3); 
      scale = scaleHappy[s];
     
      callSad.stop();
      callSurprise.stop();
      callAngry.stop();
      callHappy.start();
      
       
      ArpId =   Tone.Transport.scheduleRepeat(triggerArp, "16n");
      arp.set({
             harmonicity:8,
             modulationIndex: 2,
             oscillator : {
                 type: "sine"
             },
             envelope: {
                 attack: 0.001,
                 decay: 2,
                 sustain: 0.1,
                 release: 2
             },
             modulation : {
                 type : "square"
             },
             modulationEnvelope : {
                 attack: 0.002,
                 decay: 0.2,
                 sustain: 0,
                 release: 0.2
             },
            portamento : 0
             }); 
    
      kickPart.playbackRate = 1;
      bitcrusher.wet.linearRampToValueAtTime(0, "+1m");
      hhNote = [null]
      hhPattern(hhNote);
      distHH.playbackRate = 0.5;
      filterAngryHH.frequency.linearRampToValueAtTime(1000, "+1m");
  break;
      
      
  case 'sad':
      direction =  1;
      s= Math.floor(Math.random() * 3); 
      scale = scaleSad[s];   
      callHappy.stop();
      callSurprise.stop();
      callAngry.stop();
      callSad.start() ;
      ArpId =   Tone.Transport.scheduleRepeat(triggerArp, "4n");
      arp.set({
          harmonicity : 3 ,
          modulationIndex : 10 ,
          detune : 0 ,
          oscillator : {
          type : "sine"
          } ,
          envelope : {
          attack : 0.01 ,
          decay : 0.01 ,
          sustain : 1 ,
          release : 0.5
          } ,
          modulation : {
          type : "square"
          } ,
          modulationEnvelope : {
          attack : 0.5 ,
          decay : 0 ,
          sustain : 1 ,
          release : 0.5
          } ,
          portamento : 0.09
          });
   
     kickPart.playbackRate = 0;
     bitcrusher.wet.linearRampToValueAtTime(0, "+1m");
     hhNote = ["C2",null,null,null,
               "C2",null,null,null,
               "C2",null,null,null,
               "C2",null,null,null];
     hhPattern(hhNote)
     noiseSynth.envelope.attack=0.01;
     noiseSynth.envelope.decay= 1 ;
     noiseSynth.envelope.release = 1;
     distHH.playbackRate = 0.1;
     filterAngryHH.frequency.linearRampToValueAtTime(10, "+1m");
  break;
      
      
  case 'surprised':
      s= Math.floor(Math.random() * 3); 
      scale = scaleSurprised[s];
      
      callHappy.stop();
      callSad.stop();
      callAngry.stop();
      callSurprise.start();
      
      ArpId = Tone.Transport.scheduleRepeat(triggerArp, "64n");
      arp.set({
          harmonicity : 3 ,
          modulationIndex : 10 ,
          detune : 0 ,
          oscillator : {
          type : "sine"
          } ,
          envelope : {
          attack : 0.1 ,
          decay : 0.01 ,
          sustain : 1 ,
          release : 0.5
          } ,
          modulation : {
          type : "square"
          } ,
          modulationEnvelope : {
          attack : 0.5 ,
          decay : 0 ,
          sustain : 1 ,
          release : 0.5
          },
         portamento : 0
          });

     kickPart.playbackRate = 0;
     bitcrusher.wet.linearRampToValueAtTime(0, "+1m","+16n"); 
     hhNote = [["A#1","A#1","A#1","A#1"],"A#1",
               ["A#1","A#1","A#1","A#1"],"A#1",
               ["A#1","A#1","A#1","A#1"],"A#1",
               "A#1","A#1","A#1","A#1","A#1","A#1","A#1"];
     hhPattern(hhNote);
    
     noiseSynth.envelope.attack   = 0.91;
     noiseSynth.envelope.decay   = 0.11;
     noiseSynth.envelope.release = 1;
     distHH.playbackRate = 1;
     filterAngryHH.frequency.linearRampToValueAtTime(20000, "+1m");
  break;
      
      
  case 'angry':
      s= Math.floor(Math.random() * 3); 
    
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
              modulationType : "triangle",
              modulationIndex : 20,
              harmonicity : 3
          },
          envelope: {
              attack: 0.05,
              decay: 0.3,
              sustain: 1,
              release: 1.2
          },
          modulation : {
              volume : 0,
              type: "triangle"
          },
          modulationEnvelope : {
              attack: 0.35,
              decay: 0.1,
              sustain: 1,
              release: 0.01
          }, 
          portamento : 0
          });
     
     kickPart.playbackRate = 1;
     bitcrusher.wet.value = 0.4;
      
     hhNote = [["A#1","A#1","A#1","A#1"],"C2","C2","C2",
               null,"A#1","C2","C2",
               null,"A#1","C2","C2",
               null,"A#1","C2","C2"];
     hhPattern(hhNote)
     noiseSynth.envelope.attack=0.001;
     noiseSynth.envelope.decay  = 0.04;
     noiseSynth.envelope.release = 0.0011;
     distHH.playbackRate = 1;
     filterAngryHH.frequency.linearRampToValueAtTime(0, "+1m");
     break;
  }
  }
}
