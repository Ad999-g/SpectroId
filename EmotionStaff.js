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
        var photoCanvas  = document.querySelector('#photoCanvas');
        var slide = document.getElementById("slide");
        var ec = new emotionClassifier();
				// canvas for copying videoframes to
		var videocanvas = document.createElement('CANVAS');
		videocanvas.width = vid_width;
		videocanvas.height = vid_height;
        var premotion=[];
        var fd = new faceDeformer();
        var pn,pos,cp;
        var happytxt =   document.getElementById("happy");
        var surprisedtxt = document.getElementById("wow");
        var sadtxt =   document.getElementById("sad");
        var angrytxt =   document.getElementById("angry");
        var animationRequest;


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


				$(window).load(function() {  
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

				   function gumSuccess( stream ) {
					// add camera stream if getUserMedia succeeded
					  if ("srcObject" in vid) {
            video = document.createElement('video');
						vid.srcObject = stream;
            const input = document.getElementById('video');
					} else {
						vid.src = (window.URL && window.URL.createObjectURL(stream));
					}
					  vid.onloadedmetadata = function() {
						// resize overlay and video if proportions are different
						var proportion = vid.videoWidth/vid.videoHeight;
						vid_width = Math.round(vid_height * proportion);
						vid.width = vid_width;
						webgl_overlay.width = vid_width;
						videocanvas.width = vid_width;
						overlay.width = vid_width;
						fd.init(webgl_overlay);
						vid.play();
					}
				}

				function gumFail() {
					 // fall back to video if getUserMedia failed	
					 alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
				  }
				   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				   window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
				// check for camerasupport
			  	  if (navigator.mediaDevices) {
			  		navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
			  	} else if (navigator.getUserMedia) {
			  		navigator.getUserMedia({video : true}, gumSuccess, gumFail);
			  	} else {		
          
					  alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
				  }

//****** click START Event **********//

				  vid.addEventListener('canplay', function() {videoReady = true;enablestart();}, false);
 
/*********** Code for face substitution *********/
        var mouth_vertices = [
					[44,45,61,44],
					[45,46,61,45],
					[46,60,61,46],
					[46,47,60,46],
					[47,48,60,47],
					[48,59,60,48],
					[48,49,59,48],
					[49,50,59,49],
					[50,51,58,50],
					[51,52,58,51],
					[52,57,58,52],
					[52,53,57,52],
					[53,54,57,53],
					[54,56,57,54],
					[54,55,56,54],
					[55,44,56,55],
					[44,61,56,44],
					[61,60,56,61],
					[56,57,60,56],
					[57,59,60,57],
					[57,58,59,57],
					[50,58,59,50],
				];
				var extendVertices = [
					[0,71,72,0],
					[0,72,1,0],
					[1,72,73,1],
					[1,73,2,1],
					[2,73,74,2],
					[2,74,3,2],
					[3,74,75,3],
					[3,75,4,3],
					[4,75,76,4],
					[4,76,5,4],
					[5,76,77,5],
					[5,77,6,5],
					[6,77,78,6],
					[6,78,7,6],
					[7,78,79,7],
					[7,79,8,7],
					[8,79,80,8],
					[8,80,9,8],
					[9,80,81,9],
					[9,81,10,9],
					[10,81,82,10],
					[10,82,11,10],
					[11,82,83,11],
					[11,83,12,11],
					[12,83,84,12],
					[12,84,13,12],
					[13,84,85,13],
					[13,85,14,13],
					[14,85,86,14],
					[14,86,15,14],
					[15,86,87,15],
					[15,87,16,15],
					[16,87,88,16],
					[16,88,17,16],
					[17,88,89,17],
					[17,89,18,17],
					[18,89,93,18],
					[18,93,22,18],
					[22,93,21,22],
					[93,92,21,93],
					[21,92,20,21],
					[92,91,20,92],
					[20,91,19,20],
					[91,90,19,91],
					[19,90,71,19],
					[19,71,0,19]
				]
       
        var ctrack = new clm.tracker({constantVelocity:true,useWebGL:true,scoreThreshold:0.5,searchWindow : 11,maxIterationsPerAnimFrame:1,sharpenResponse:false});
       // var ctrack = new clm.tracker(pModel);    // default model
				ctrack.init(pModel);
        ctrack.setResponseMode("cycle",["lbp","sobel"]);     
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
      
    function  checkConvergence(){  
            overlayCC.clearRect(0, 0, vid_width, vid_height);
            pn = ctrack.getConvergence();
          if (pn < 1){
             myCallback(); 
            slide.style.opacity=1;
            RobotVoice.stop();
            window.cancelAnimationFrame(checkConvergence); 
            document.getElementById("webgl").addEventListener("click",snapshot);
            hhPart.start();
            //Tone.Transport.scheduleRepeat(triggerHH, "16n");
		       // drawGridLoop();
            drawMaskLoop(pos,cp);
           }else{
           pos = ctrack.getCurrentPosition(); 
           cp = ctrack.getCurrentParameters()
           ctrack.draw(overlay,cp,"vertices");
           var check = requestAnimationFrame(checkConvergence);
           }
        }
		 var emotion;
         var maax = 0;
				 function drawGridLoop() {  
         const startTime = performance.now();
    			// get position of face
           cp = ctrack.getCurrentParameters();
			     pos = ctrack.getCurrentPosition(); 
           pn = ctrack.getConvergence();	
       var er = ec.meanPredict(cp);
       var  opacity= 1-(pn/9990);          
            webgl_overlay.style.opacity = opacity;
       var emotions=[er[0],er[1],er[2],er[3]];                    
					// check whether mask has converged
         
			    if (er) {  
          var angry = (er[0].value/1)*(-32);
          var sad   = (er[1].value/1)*(-32);
          var surprised = (er[2].value/1)*(-32);
				  var happy = (er[3].value/1)*(23);
          maax = Math.max.apply(Math, er.map(function(o) { return o.value;}))
          
           for(var i=0;i<4;i++){
           if(er[i].value===maax){
           emotion = er[i].emotion;
           premotion.push(emotion);
              }
            }
            if(premotion.length>2){
                premotion.shift();
                }
            if(premotion[0]!=premotion[1] ){
                neon();
              setNewEmo(emotion);
                
            }
             switch (premotion[1]) {
            case 'angry':
            ph["component 15"]=angry;
            ph["component 3"]=0;
            ph["component 13"]=0;
            ph["component 17"]=0;
            break;
            case 'sad':
            ph["component 13"]=sad;
            ph["component 3"]=0;
            ph["component 15"]=0;
            ph["component 17"]=0;
            break;
            case 'surprised':
            ph["component 3"]= surprised;
            ph["component 13"]=0;
            ph["component 15"]=0;
            ph["component 17"]=0;
            break;  
            case 'happy':
            ph["component 17"]=happy; 
            ph["component 3"]=0;
            ph["component 13"]=0;
            ph["component 15"]=0;
            break;
           }
              updateData(er);
            }
             var  duration = performance.now() - startTime;          
              drawMaskLoop(pos,cp);
            
   
           }
				function drawMaskLoop(pos,parameters) {
                
videocanvas.getContext('2d').drawImage(vid,0,0,videocanvas.width,videocanvas.height);   
					  if (pos) {
						// create additional points around face
						var tempPos;
						var addPos = [];
						for (var i = 0;i < 23;i++) {
							tempPos = [];
							tempPos[0] = (pos[i][0] - pos[62][0])*1.3 + pos[62][0];
							tempPos[1] = (pos[i][1] - pos[62][1])*1.3 + pos[62][1];
							addPos.push(tempPos);
						}
						// merge with pos
						var newPos = pos.concat(addPos);
						var newVertices = pModel.path.vertices.concat(mouth_vertices);
						// merge with newVertices
						newVertices = newVertices.concat(extendVertices);
						fd.load(videocanvas, newPos, pModel,newVertices); 
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

         function neon(){
           var color;
         
          
           if(premotion[1]=== "happy"){
           color = '#ffcf00';
           clear=happytxt;
           animation();  
           }else{
           clear=happytxt;
           stopanimation();
           }
           if (premotion[1]=== "surprised" ){
           color = '#ff4d00';
           clear=surprisedtxt;
           animation();           
           }else{
           clear=surprisedtxt;
           stopanimation();
           }
           if(premotion[1]=== "sad" ){ 
           color = '#0033ff';
           clear=sadtxt;
           animation();  
           }else{
           clear=sadtxt;
           stopanimation();
           }
           if(premotion[1]=== "angry" ){
           color = '#F00033';
           clear=angrytxt;
           animation();  
           }else{
           clear=angrytxt;
           stopanimation();
           }
          function animation() {
            clear.style.textShadow = color+" 0px 0px 5px, "+color+" 0px 0px 10px,"+color+"  0px 0px 15px,"+color+" 0px 0px 20px,"+color+" 0px 0px 30px,"+color+" 0px 0px 40px,"+color+" 0px 0px 50px,"+color+" 0px 0px 75px";
            clear.style.transition= " transform .4s";
            clear.style.transform= " rotateY(2deg)";      
            }
          function stopanimation(){
         // clear.style.transition= " transform .4s";
            clear.style.textShadow ="";                
            clear.style.transform= " rotateY(40deg)";
          }            
          }





				/********** parameter code *********/

				var pnums = pModel.shapeModel.eigenValues.length-2;
				var parameterHolder = function() {
          	this['component '+(3)] = 0;
          	this['component '+(13)] = 0;
            this['component '+(15)] = 0;
            this['component '+(17)] = 0;
            for (var i = 0;i < pnums;i++) {
						this['component '+(i+3)] = 0;
            
					}
				}
    
				var ph = new parameterHolder();
				var gui = new dat.GUI();
        dat.GUI.toggleHide();
				var control = {};
				var eig = 0;
       
				for (var i = 0;i < pnums;i++) {
				eig = Math.sqrt(pModel.shapeModel.eigenValues[i+2])*3;
      //   //  control['c'+(i+3)] = gui.add(ph, 'component '+(i+3), -5*eig, 5*eig).listen();
			}

				control['c'+(3)] = gui.add(ph, 'component '+(3), 0,-6*eig).listen();
        control['c'+(13)] = gui.add(ph, 'component '+(13), 0, -5*eig).listen();
        control['c'+(15)] = gui.add(ph, 'component '+(15), 0, -6*eig).listen();
        control['c'+(17)] = gui.add(ph, 'component '+(17), 0, 5*eig).listen();
 
       // ec.init(emotionModel);
				var emotionData = ec.getBlank();
      
/************ d3 code for barchart *****************/
				var margin = {top : 20, right : 40, bottom : 10, left : 40},
					width = 600 - margin.left - margin.right,
					height = 250 - margin.top - margin.bottom;
				var barWidth = 30;
				var formatPercent = d3.format(".0%");
       
				var x = d3.scale.linear()
					.domain([0, ec.getEmotions().length]).range([margin.left, width+margin.left]);
				var y = d3.scale.linear()
					.domain([0,1]).range([0, height]);
				var svg = d3.select("#emotion_chart").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom);
				svg.selectAll("rect").
					data(emotionData).
					enter().
					append("svg:rect").
					attr("x", function(datum, index) { return x(index); }).
					attr("y", function(datum) { return height - y(datum.value); }).
					attr("height", function(datum) { return y(datum.value); }).
					attr("width", barWidth).
					attr("fill",function(datum, index) { return colorPicker(x(index));});

          function colorPicker(v){
     
          if(v<60) { return "#F00033"}
          else if(v<300){ return "#0033ff"}
          else if(v<430){ return "#ff4d00"}
          else if(v<600){ return "#ffcf00"}}
         

				function updateData(data) {
					// update
					var rects = svg.selectAll("rect")
						.data(data)
						.attr("y", function(datum) { return height - y(datum.value); })
						.attr("height", function(datum) { return y(datum.value); });
					var texts = svg.selectAll("text.labels")
						.data(data)
						.attr("y", function(datum) { return height - y(datum.value); })
						.text(function(datum) { return datum.value.toFixed(1);});
					// enter
					rects.enter().append("svg:rect");
					texts.enter().append("svg:text");
					// exit
					rects.exit().remove();
					texts.exit().remove();
				}




