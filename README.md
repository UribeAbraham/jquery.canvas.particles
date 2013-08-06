jquery.canvas.particles
=======================

create particles over HTML elements using canvas
Demo: <a href="http://worzt.github.io/jquery.canvas.particles/">http://worzt.github.io/jquery.canvas.particles/</a>

Getting Started
=======================
Include jQuery, jquery.canvas.particles.js, style.css and call <code>.particles</code> method on some jquery object
```html
<html>
<head>
	<link rel="stylesheet" type="text/css" href="style.css" media="screen" />
</head>
<body>
  <div id="test">test</div>
	<script src="jquery.js"></script>
	<script src="jquery.particles.js"></script>
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
		stop:false, //default state on init
		end:"change", //after finishing change or remove particle
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
		layout:"before",  //befor or after element content 
		bound:"back", //if particle position is outside element "back" return to the other side and "bounce" change direction
		create:false, //event handler when init is ready
		addParticle:false,  //event handler when a new particle is added return the new particle
		stateChange:false,  //event handler when the state change  return playing or stopped
		removeParticle:false  //event handler when a particle is removed return the particle
};
```
Methods
=======================
add new particle
```javascript
//add new particle with default values
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
$(this).particles("stop");
```
destroy the particles and all the default values
```javascript
$(this).particles("destroy");
```
Events
=======================
create
```javascript
$(this).on("create",function(){console.log("create")});
//Initialize with the create callback specified
$(this).particles(
    create:function(){}
  );
```
addParticle
```javascript
$(this).on("addParticle",function(event,particle){console.log("addParticle")});
//Initialize with the addParticle callback specified
$(this).particles(
    addParticle:function(){}
  );
```
stateChange
```javascript
$(this).on("stateChange",function(event,state){console.log(state)});
//Initialize with the stateChange callback specified
$(this).particles(
    stateChange:function(){}
  );
```
removeParticle
```javascript
$(this).on("removeParticle",function(event,particle){console.log("removeParticle")});
//Initialize with the removeParticle callback specified
$(this).particles(
    removeParticle:function(){}
  );
```
