var drop = new Tone.GrainPlayer("https://s3-us-west-2.amazonaws.com/s.cdpn.io/6859/open-bubble-2.mp3",
     function(){     
     drop.loop = false;
     drop.playbackRate = 0.9;
     drop.volume.value=-5;
     }).toMaster();

 var RobotVoice = new Tone.GrainPlayer("https://actam.s3.us-east-2.amazonaws.com/141+to+160+bpm/RobotVoice.wav", function(){     
     RobotVoice.loop = true;
     RobotVoice.playbackRate = 0.9;
     RobotVoice.volume.value=-5;
     }).toMaster();

 var noiseSynth = new Tone.NoiseSynth({
    envelope  : {
    attack  : 0.001 ,
    decay  : 0.04 ,
    sustain  : 0.01 ,
    release  : 0.0011 
    }});

noiseSynth.volume.value = -25;

var AngryHH = new Tone.PluckSynth();

 var kick = new Tone.MembraneSynth({	
		  "envelope" : {
			"attack" : 0.05,
			"decay" : 0.8,
			"sustain" : 0.1
		}
	}).toMaster();
 kick.volume.value = -10;

var arp = new Tone.FMSynth();
    arp.volume.value = -13;

var step = 0;
var arpStep = 0;
function triggerArp(time) {
  if (arpActive) {     
    var n = midiToFreq(root + scale[arpStep % scale.length ] ); //
    arp.triggerAttackRelease(n,arp.toSeconds('8n'),time, Math.random()); 
   
    }
    switch (direction) {
    case 0:
      arpStep++;
      break;
    case 1:
      arpStep--;
      break;
    }
   
    if (arpStep >= 200*scale.length) {
      arpStep = 0;
    } else if (arpStep < 0) {
      arpStep = 200*scale.length;
    }
    }
  
 
var kickPart = new Tone.Sequence(function(time, note) {
    kick.triggerAttackRelease(note,"4n",time);
  }, ['C1','E1','E1','B0'], "4n" ); 

var hhNote = ["A#1","C2","C2","C2","A#1","C2","C2","C2"];
var hhVel = 1;
var hhPart = new Tone.Sequence(function(time, note) {
     hhVel = Math.random();
     HHpanner.pan.value = Math.random()*2 -1;
    //hhPart.events = hhNote
    noiseSynth.triggerAttackRelease("32n",time,hhVel);
  },hhNote , "16n" );

function hhPattern(pattern){
  hhPart.removeAll();
  for(i = 0; i<=pattern.length;i++){
  hhPart.at(i,pattern[i]);
  }
  }

var distHH = new Tone.Sequence(function(time, note) {
    Angrypanner.pan.value = Math.random()*2 -1
    AngryHH.volume.value = -10;//-(Math.random()*10+10);
    AngryHH.triggerAttack(note, time);
  }, ["A1","C2","C2","C2",null], "16n" );

function distHHPattern(root){
  var k = midiToFreq(root-12);
  var k_12 = midiToFreq(root-24);
  distHH.removeAll(); 
  distHH.at(0,k_12);
  distHH.at(1,k);
  distHH.at(2,k);
  distHH.at(3,k); 
  distHH.at(4,null);
  }
      /**********EFFECTS***********/
var pingPong = new Tone.PingPongDelay('8n');
pingPong.feedback.value=0.8;

var Chorus = new Tone.Chorus(1).toMaster();
arp.chain(Chorus);
Chorus.connect(pingPong);

arpFilter = new Tone.Filter().toMaster();
pingPong.connect(arpFilter);
arpFilter.frequency.value=1500;


   var Sadnessdelay = new Tone.FeedbackDelay("8n",0.25);
      Sadnessdelay.wet.value = 1;

  kick.chain( Tone.Master );

  var bitcrusher = new Tone.BitCrusher(); 
  bitcrusher.wet.value = 0;
  kick.chain(bitcrusher,Tone.Master);

  var reverb = new Tone.Freeverb({
    roomSize  : 0.9 ,
    dampening  : 8000
  });
  reverb.wet.value = 0.06;
  
  var filterHH = new Tone.Filter( {
     type : 'highpass' ,
     frequency : 450 ,
     rolloff : -12 ,
     Q : 4 ,
     gain : 0
     });
  var HHpanner = new Tone.Panner();
  var HHlfo = new Tone.LFO(0.6, 100, 10000);
  HHlfo.connect(filterHH.frequency);
  HHlfo.start();
  noiseSynth.chain(filterHH,HHpanner,reverb, Tone.Master);
  

  var filterAngryHH = new Tone.Filter( {
     type : 'highpass' ,
     frequency : 100 ,
     rolloff : -12 ,
     Q : 4 ,
     gain : 0
     });
  var Angrypanner = new Tone.Panner();
  AngryHH.chain(Angrypanner,filterAngryHH, Sadnessdelay, Tone.Master);
  function snapshot(){
          
          cancelAnimationFrame(animationRequest);
          document.getElementById("content").remove(); 
          snap = true;
          ctrack.stop();
         
          w = photoCanvas.width = videocanvas.width;
          h = photoCanvas.height = videocanvas.height;
          photoCanvas.getContext('2d').drawImage(vid,0,0,photoCanvas.width,photoCanvas.height);
          ctx = photoCanvas.getContext('2d');
          ctx.translate(w, h);
          ctx.rotate(180 * Math.PI / 180);
          frame = ctx.getImageData(0, 0, w, h);
          ctx.clearRect(0,0,w,h)
      
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
   
         setTimeout(phasetwo , 10);
           // return phasetwo();
        }
   