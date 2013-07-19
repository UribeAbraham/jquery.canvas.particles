$.fn.particles=function(method){
  var pi=2 * Math.PI;
	var defaults={
		particles:5,
		stop:false,
		randomradius:false,
		radius:5,
		minradius:3,
		randomduration:false,
		duration:10000,//10s
		minduration:1000,//1s
		randomspeed:false,
		speed:1,
		minspeed:.2,
		randomopacity:false,
		opacity:1,
		minopacity:0,
		animopacity:true,
		decayopacity:true,
		x:0,
		y:0,
		randompoint:false,
		randomcolor:true,
		color:{r:255,g:255,b:255},
		mincolor:{r:0,g:0,b:0},
		end:"change",//change,remove
		randomdir:{x:true,y:true},		
		image:false,
		firststep:-20
	};
	var requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();
	var methods={
		init:function(opt){
			opt=$.extend({},defaults,opt||{});
			return this.each(function(){
				var ele=$(this);
				var el=this;
				var canvas=$("<canvas width='"+ele.width()+"' height='"+ele.height()+"'></canvas>");
				ele.append(canvas);
				canvas.css({"position":"absolute","top":"0px","left":"0px"});
				var ctx = canvas.get(0).getContext("2d");
				el.parts=$.extend({},opt||{});
				if(el.parts.image){
					var src=el.parts.image;
					el.parts.image=new Image();
					el.parts.image.src=src;
				}
				el.parts.part=[];
				el.parts.canvas={};
				el.parts.canvas.ctx=ctx;
				el.parts.canvas.cw=canvas.width();
				el.parts.canvas.ch=canvas.height();
				el.parts.canvas.co=canvas;
				el.parts.id=$(el).attr("id");
				for(var i=0;i<el.parts.particles;i++){
					var crand=Math.random();
					ele.particles("addParticle",{
							"x":el.parts.randompoint?parseInt(Math.random()*canvas.width()):el.parts.x,
							"y":el.parts.randompoint?parseInt(Math.random()*canvas.height()):el.parts.y,
							"radius":el.parts.randomradius?(Math.random()*(el.parts.radius-el.parts.minradius))+el.parts.minradius:el.parts.radius,
							"duration":el.parts.randomduration?parseInt(Math.random()*(el.parts.duration-el.parts.minduration))+el.parts.minduration:el.parts.duration,
							"speed":el.parts.randomspeed?(Math.random()*(el.parts.speed-el.parts.minspeed))+el.parts.minspeed:el.parts.speed,
							"opacity":el.parts.randomopacity?(Math.random()*(el.parts.opacity-el.parts.minopacity))+el.parts.minopacity:el.parts.opacity,
							"color":el.parts.randomcolor?{r:parseInt(crand*(el.parts.color.r-el.parts.mincolor.r)+el.parts.mincolor.r),g:parseInt(crand*(el.parts.color.g-el.parts.mincolor.g)+el.parts.mincolor.g),b:parseInt(crand*(el.parts.color.b-el.parts.mincolor.b)+el.parts.mincolor.b)}:el.parts.color
						}
					);
				}
				$(el).particles("step");	
			});
		},
		addParticle:function(p){
			return this.each(function(){
				var el=this;
				var o=new Object();
				o.speed=p.speed?p.speed:el.parts.speed;
				o.steps=p.firststep?p.firststep:el.parts.firststep;
				o.dirx=(parseInt(Math.random()*2)==0)?1:(parseInt(Math.random()*2)==1)?Math.random():-1;
				o.diry=(parseInt(Math.random()*2)==0)?1:-1;
				o.alpha=0;	
				o.maxsteps=p.duration?p.duration/(1000/60):el.parts.duration/(1000/60);	
				o.maxalpha=p.opacity?p.opacity:el.parts.opacity;
				o.opacity=o.maxalpha;
				o.rad=p.radius?p.radius:el.parts.radius;
				o.color=p.color?p.color:el.parts.color;
				o.duration=p.duration?p.duration/(1000/60):el.parts.duration/(1000/60);
				o.image=p.image?p.image:el.parts.image;
				if(o.image&&!o.image.src){
					var src=o.image;
					o.image=new Image();
					o.image.src=src;
				}
				o.update=function(){
					if(o.steps>=o.maxsteps){
						if(el.parts.animopacity){
							if(el.parts.decayopacity){
								o.steps=el.parts.randomduration?-(parseInt(Math.random()*el.parts.firststep)):el.parts.firststep;
							}
						}
						if(el.parts.end=="remove"){
							o.steps=el.parts.randomduration?-(parseInt(Math.random()*el.parts.firststep)):el.parts.firststep;
							o.remove=true;
						}
						else if(el.parts.end=="change"){
							o.steps=el.parts.randomduration?-(parseInt(Math.random()*el.parts.firststep)):el.parts.firststep;
							o.dirx=(parseInt(Math.random()*2)==0&&el.parts.randomdir.x)?1:(parseInt(Math.random()*2)==1)?Math.random():-1;
							o.diry=(parseInt(Math.random()*2)==0&&el.parts.randomdir.y)?1:-1;
							o.maxsteps=el.parts.randomduration?parseInt(Math.random()*(o.duration-(el.parts.minduration/(1000/60))))+(el.parts.minduration/(1000/60)):o.duration;
							o.rad=el.parts.randomradius?(Math.random()*(el.parts.radius-el.parts.minradius))+el.parts.minradius:el.parts.radius;
							o.speed=el.parts.randomspeed?(Math.random()*(el.parts.speed-el.parts.minspeed))+el.parts.minspeed:el.parts.speed;
							o.maxalpha=el.parts.randomopacity?(Math.random()*(el.parts.opacity-el.parts.minopacity))+el.parts.minopacity:el.parts.opacity;
						}
					}				
					else if(Math.floor(Math.random()*o.maxsteps)==1&&(o.steps%60)==0){
						o.dirx=(parseInt(Math.random()*2)==0)?1:(parseInt(Math.random()*2)==1)?Math.random():-1;
						o.diry=(parseInt(Math.random()*2)==0)?1:-1;
					}
					if(el.parts.animopacity){
						if(el.parts.decayopacity){
							if(o.steps<(o.maxsteps/2)){
								o.alpha=(o.steps/(o.maxsteps/2))*o.maxalpha;
							}
							else{
								o.alpha=((o.maxsteps-o.steps)/(o.maxsteps/2))*o.maxalpha;
							}
						}
						else{
							if(o.alpha<o.opacity-.1){
								o.alpha=(o.steps/o.maxsteps)*o.maxalpha;
							}
							else{
								o.alpha=o.opacity;
							}
						}
					}
					else{
						o.alpha=o.opacity;
					}							
					p.x = p.x+(o.dirx*o.speed);
					p.y = p.y+(Math.sin(pi*(p.x/el.parts.canvas.cw))*(o.diry*o.speed));
					if (p.x > el.parts.canvas.cw+o.rad+2) p.x = -o.rad;
					else if (p.x < -(o.rad+2)) p.x = el.parts.canvas.cw+o.rad;
					if (p.y > el.parts.canvas.ch+o.rad+2) p.y = -o.rad;
					else if (p.y < -(o.rad+2)) p.y = el.parts.canvas.ch+o.rad;		
					if(o.image){
						el.parts.canvas.ctx.save();
						el.parts.canvas.ctx.translate(p.x, p.y);
						el.parts.canvas.ctx.globalAlpha=o.alpha<0?0:o.alpha;
						el.parts.canvas.ctx.drawImage(o.image,-o.rad,-o.rad,o.rad*2,(o.rad*2)*o.image.height/o.image.width);
						el.parts.canvas.ctx.restore();
					}
					else{
						el.parts.canvas.ctx.beginPath();
						el.parts.canvas.ctx.arc(p.x,p.y,o.rad,0,pi, false);
						el.parts.canvas.ctx.fillStyle = "rgba("+o.color.r+","+o.color.g+","+o.color.b+","+o.alpha+")";
						el.parts.canvas.ctx.fill();
					}
					o.steps++;
				}
				el.parts.part.push(o);
			});
		},
		stopParticles:function(){
			return this.each(function(){
				var el=this;
				if(this.parts.stop==false){
					this.parts.stop=true;
				}else{
					this.parts.stop=false;
					$(el).particles("step");
				}
			});
		},
		step:function(){
			return this.each(function(){
				var el=this;
				if(this.parts.stop==false){
					el.parts.canvas.ctx.clearRect(0,0,el.parts.canvas.cw,el.parts.canvas.ch);
					$.each(el.parts.part,function(i,n){
						if(n&&!n.remove){
							n.update();
						}
					});
					$.each(el.parts.part,function(i,n){
						if(n&&n.remove&&$.inArray(n,el.parts.part)!=-1){
							el.parts.part.splice($.inArray(n,el.parts.part), 1);
						}
					});		
					requestAnimFrame(function(){
					   $(el).particles("step"); 
					});
				}
			});
		},
		destroy:function(){
			return this.each(function(){
				var el=this;
				el.parts.canvas.co.remove();
				el.parts={};
			});
		}
	};
    if(methods[method]){
		return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
    }else if(typeof method==='object'||!method){
		return methods.init.apply(this,arguments);
    }else{
		$.error('Method '+method+' does not exist on jquery.canvas.particles');
    }
};
