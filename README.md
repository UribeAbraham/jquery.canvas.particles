jquery.canvas.particles
=======================

create particles over HTML elements using canvas
Demo: <a href="http://uribeabraham.github.io/jquery.canvas.particles/">http://uribeabraham.github.io/jquery.canvas.particles/</a>

Getting Started
=======================
Without jQuery
Include jquery.canvas.particles.js, style.css and call <code>new particles(elemement,options)</code>
```html
<html>
<head>
  <link rel="stylesheet" type="text/css" href="style.css" media="screen" />
</head>
<body>
  <div id="test">test</div>
  <script src="jquery.canvas.particles.js"></script>
  <script>
  	var particleObj = new particles(document.querySelector('#test'),{});
  </script>
</body>
</html>
```

With jQuery
Include jQuery, jquery.canvas.particles.js, style.css and call <code>.particles</code> method on some jquery object
```html
<html>
<head>
  <link rel="stylesheet" type="text/css" href="style.css" media="screen" />
</head>
<body>
  <div id="test">test</div>
  <script src="jquery.js"></script>
  <script src="jquery.canvas.particles.js"></script>
  <script>
	$("#test").particles();
  </script>
</body>
</html>
```
Options
=======================
```javascript
var defaults={
  	amount:10,  //amount of particles to add on init
	state:"playing", //default state on init "playing"||"stopped"
	end:"change", //after finishing "change" or "remove" particle
	dir:{ //direction
		x:1,  // 1||0||-1
		y:1,  // 1||0||-1
		xrand:true, //random dir.x
		yrand:true, //random dir.y
		rand:true,  //random change of dir.x and dir.y
		xfunction:function(dx,px,dy,py,s,w,h){return px+=dx*s;},  //determines the x movement
		yfunction:function(dx,px,dy,py,s,w,h){return py+=(Math.sin(2*Math.PI*(px/w))*(dy*s))} //determines the y movement
	},
	image:false,  //image url to use as particle
	radius:{  //radius
		radius:5, //if radius random is true then this is max radius
		random:false, //random radius between radius.radius and radius.min
		min:3 //minimum radius if radius.random is false then it is omitted 
	},
	duration:{  //each particle duration
		duration:10000, //1000 == 1s default 10s
		random:false, //random between duration.duration and duration.min
		min:1000, //minimum duration default 1s
		firststep:-2000 //time between duration end and restart if end=="change"
	},
	speed:{ //speed
		speed:1,  //default value to use on dir.xfunction and dir.yfunction
		random:false, //random between speed.speed and speed.min
		min:.2  //minimum speed default .2 times the movement
	},	
	opacity:{ //opacity
		opacity:1,  //default opacity 1 if opacity.animation or opacity.random it is max opacity
		random:false, //random between opacity.opacity and opacity.min
		min:0,  //minimum opacity default 0 
		animation:true, //if true opacity increases until max opacity 
		decay:true  //if true opacity decreases until min opacity
	},
	position:{  //start position inside element
		x:0,  //x position default 0
		y:0,  //y position default 0
		random:false  //if true get random point inside element
	},
	color:{ //color
		color:{r:255,g:255,b:255},  //default color for particles rgb(255,255,255)
		random:false, //if true get color between color.color and color.min
		min:{r:0,g:0,b:0} //minimum color default rgb(0,0,0)
	},
	layout:"before",  //before or after element content 
	bound:"back", //if particle position is outside element "back" return to the other side and "bounce" change direction
	create:false, //event handler when init is ready
	addParticle:false,  //event handler when a new particle is added return the new particle in event.detail.added
	stateChange:false,  //event handler when the state change  return "playing" or "stopped" in event.detail.state
	removeParticle:false  //event handler when a particle is removed return the particle in event.detail.removed
};
```
Methods
=======================
add new particle
```javascript
//add new particle with default values  trigger "addParticle.particles" event
particleObj.add();
//add new particle with object for custom values
particleObj.add({
  radius:{radius:3,random:true},
  duration:{duration:7000},
  speed:{speed:1}	
});
```
With jQuery
```javascript
//add new particle with default values  trigger "addParticle.particles" event
$(this).particles("add");
//add new particle with object for custom values
$(this).particles("add",{
  radius:{radius:3,random:true},
  duration:{duration:7000},
  speed:{speed:1}	
});
```
stop the particles
```javascript
//change current state  trigger "stateChange.particles" event
particleObj.stop();
```
With jQuery
```javascript
//change current state  trigger "stateChange.particles" event
$(this).particles("stop");
```
destroy the particles and all the default values
```javascript
//remove the EventListeners for addParticle,stateChange and removeParticle options
particleObj.destroy();
```
With jQuery
```javascript
//remove the EventListeners for addParticle,stateChange and removeParticle options
$(this).particles("destroy");
```
Events
=======================
create
```javascript
particleObj.addEventListener("create.particles",function(event){console.log("create");});
```
With jQuery
```javascript
$(this).on("create.particles",function(event){console.log("create");});
//Initialize with the create callback specified
$(this).particles(
    create:function(){}
);
```
addParticle
```javascript
particleObj.addEventListener("addParticle.particles",function(event){console.log("addParticle");});
```
With jQuery
```javascript
$(this).on("addParticle.particles",function(event){console.log("addParticle");});
//Initialize with the addParticle callback specified
$(this).particles(
    addParticle:function(event){console.log(event.detail.added);}
);
```
stateChange
```javascript
particleObj.addEventListener("stateChange.particles",function(event){console.log(event.detail.state);});
```
With jQuery
```javascript
$(this).on("stateChange.particles",function(event){console.log(event.detail.state);});
//Initialize with the stateChange callback specified
$(this).particles(
    stateChange:function(event){console.log(event.detail.state);}
);
```
removeParticle
```javascript
particleObj.addEventListener("removeParticle.particles",function(event){console.log("removeParticle");});
```
With jQuery
```javascript
$(this).on("removeParticle.particles",function(event){console.log("removeParticle");});
//Initialize with the removeParticle callback specified
$(this).particles(
    removeParticle:function(event){console.log(event.detail.removed);}
);
```
