/*
 * jquery.canvas.particles
 * http://uribeabraham.github.io/jquery.canvas.particles/
 * MIT License
 */
(function() {

	if($){
		$.fn.particles=function(method){
			var methods={
				init:function(opt){
					return this.each(function(){
						this.particlesData=new particles(this,opt);
						$(this).trigger("create.particles");
					});
				},
				add:function(p){
					return this.each(function(){
						this.particlesData.add(p);
					});
				},
				stop:function(){
					return this.each(function(){
						this.particlesData.stop();
						$(this).trigger({type:"stateChange.particles",detail:{"state":this.particlesData.state}});
					});
				},
				step:function(){
					return this.each(function(){
						this.particlesData.step();
					});
				},
				destroy:function(){
					return this.each(function(){
						this.particlesData.destroy();
					});
				}
			};		
			if(methods[method]){
				return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
			}else if(typeof method==='object'||!method){
				return methods.init.apply(this,arguments);
			}else{
				$.error('Method '+method+' does not exist on jQuery.canvas.particles.js');
			}
		};
	}
	
	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}
	CustomEvent.prototype = window.Event.prototype;
	
	var pi=2*Math.PI,frames=1000/60;
	
	this.particles = function(elem,options) {
		var defaults={
			amount:10,
			state:"playing",
			end:"change",
			dir:{
				x:1,
				y:1,
				xrand:true,
				yrand:true,
				rand:true,
				xfunction:function(dx,px,dy,py,s,w,h){return px+=dx*s;},
				yfunction:function(dx,px,dy,py,s,w,h){return py+=(Math.sin(pi*(px/w))*(dy*s))}
			},
			image:false,
			radius:{
				radius:5,
				random:false,
				min:3
			},
			duration:{
				duration:10000,
				random:false,
				min:1000,
				firststep:-2000
			},
			speed:{
				speed:1,
				random:false,
				min:.2
			},	
			opacity:{
				opacity:1,
				random:false,
				min:0,
				animation:true,
				decay:true
			},
			position:{
				x:0,
				y:0,
				random:false
			},
			color:{
				color:{r:255,g:255,b:255},
				random:false,
				min:{r:0,g:0,b:0}
			},
			layout:"before",
			bound:"back",
			create:false,
			addParticle:false,
			stateChange:false,
			removeParticle:false
		}, o=extendObject({},defaults,options||{});
		o.element=elem;
		init.call(this,o);
	}
	
	var requestAnimationFrame=(function(){
		return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||
			function(callback){
				return window.setTimeout(callback,frames);
			};
	})();
	
	var cancelAnimationFrame=(function(){
		return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||
			function(id){
				clearTimeout(id);
			};
	})();
	
	function extendObject() {
		var property,obj=arguments[0],length=arguments.length;
		for(var i=1;i<length;i++){
			for (property in arguments[i]) {
				if(typeof arguments[i][property] === "object" && arguments[i][property]!= null){
					obj[property]=obj[property] || {};
					extendObject(obj[property],arguments[i][property]);
				}
				else{
					obj[property] = arguments[i][property];
				}
			}
		}
		return obj;
	}
	
	function isFunction(f){
		return typeof f==="function";
	}
	
	function init(o){
		var ele=o.element,canvas,ctx,rand,src;
		if(o.image){
			src=o.image;
			o.image=new Image();
			o.image.src=src;
		}
		canvas=document.createElement("canvas");
		canvas.width=ele.offsetWidth;
		canvas.height=ele.offsetHeight;
		canvas.className="particles";
		ctx = canvas.getContext("2d");
		o.part=[];
		o.canvas={};
		o.canvas.width=canvas.width;
		o.canvas.height=canvas.height;
		o.canvas.ctx=ctx;
		o.canvas.object=canvas;
		
		if(o.layout=="after"){
			ele.insertBefore(canvas,ele.children[0]);
		}
		else{
			ele.appendChild(canvas);
		}
		for(prop in o){
			this[prop]=o[prop];
		}
		
		for(var i=0;i<o.amount;i++){
			rand=Math.random();
			this.add({
				position:{
					x:o.position.random?parseInt(Math.random()*o.canvas.width):o.position.x,
					y:o.position.random?parseInt(Math.random()*o.canvas.height):o.position.y
				},
				radius:{
					radius:o.radius.random?(Math.random()*(o.radius.radius-o.radius.min))+o.radius.min:o.radius.radius
				},
				duration:{
					duration:o.duration.random?parseInt(Math.random()*(o.duration.duration-o.duration.min))+o.duration.min:o.duration.duration
				},
				speed:{
					speed:o.speed.random?(Math.random()*(o.speed.speed-o.speed.min))+o.speed.min:o.speed.speed
				},
				opacity:{
					opacity:o.opacity.random?(Math.random()*(o.opacity.opacity-o.opacity.min))+o.opacity.min:o.opacity.opacity
				},
				color:{
					color:o.color.random?{
						r:parseInt(rand*(o.color.color.r-o.color.min.r)+o.color.min.r),
						g:parseInt(rand*(o.color.color.g-o.color.min.g)+o.color.min.g),
						b:parseInt(rand*(o.color.color.b-o.color.min.b)+o.color.min.b)
					}:o.color.color
				}
			});
		}
		if(isFunction(o.create)){
			ele.addEventListener("create.particles",o.create);
		}
		ele.dispatchEvent(new CustomEvent("create.particles"));
		this.step();
	}
	
	particles.prototype.add=function(p){
		var data=this,ele=data.element,o,randomdir,src,e,rand;
		o={
			color:extendObject({},data.color,p.color||{}),
			duration:extendObject({},data.duration,p.duration||{}),
			end:p.end?p.end:data.end,
			image:p.image?p.image:data.image,
			opacity:extendObject({},data.opacity,p.opacity||{}),
			radius:extendObject({},data.radius,p.radius||{}),
			speed:extendObject({},data.speed,p.speed||{}),
			position:extendObject({},data.position,p.position||{}),
			dir:extendObject({},data.dir,p.dir||{}),
			bound:p.bound?p.bound:data.bound,
			alpha:0
		};
		randomdir=function(){
			o.dir.x=(o.dir.xrand)?(parseInt(Math.random()*2)==0)?Math.random()+.1:(Math.random()*-1)-.1:o.dir.x;
			o.dir.y=(o.dir.yrand)?(parseInt(Math.random()*2)==0)?Math.random()+.1:(Math.random()*-1)-.1:o.dir.y;
		};
		if(o.image&&!o.image.src){
			src=o.image;
			o.image=new Image();
			o.image.src=src;
		}
		o.position=p.position&&p.position.random?{x:parseInt(Math.random()*data.canvas.width),y:parseInt(Math.random()*data.canvas.height),random:true}:o.position;
		o.duration.duration=parseInt(o.duration.duration/frames);
		o.duration.firststep=parseInt(o.duration.firststep/frames);
		o.duration.min=parseInt(o.duration.min/frames);
		o.step=o.duration.firststep;
		randomdir();
		e={
			half:o.duration.duration/2,
			min:parseInt(data.duration.min/frames),
			duration:parseInt(data.duration.duration/frames),
			radius:data.radius.radius-data.radius.min,
			speed:data.speed.speed-data.speed.min,
			opacity:data.opacity.opacity-data.opacity.min
		};
		e.max=e.duration-e.min;
		o.update=function(){
			if(o.step>=o.duration.duration){
				o.step=o.duration.firststep;
				if(o.end=="remove"){
					o.remove=true;
				}
				else if(o.end=="change"){
					randomdir();
					rand=Math.random();
					o.duration.duration=o.duration.random?parseInt(Math.random()*e.max)+e.min:o.duration.duration;
					o.radius.radius=o.radius.random?(Math.random()*e.radius)+data.radius.min:o.radius.radius;
					o.speed.speed=o.speed.random?(Math.random()*e.speed)+data.speed.min:o.speed.speed;
					o.opacity.opacity=o.opacity.random?(Math.random()*e.opacity)+data.opacity.min:o.opacity.opacity;
					o.color.color=o.color.random?{
						r:parseInt(rand*(data.color.color.r-data.color.min.r)+data.color.min.r),
						g:parseInt(rand*(data.color.color.g-data.color.min.g)+data.color.min.g),
						b:parseInt(rand*(data.color.color.b-data.color.min.b)+data.color.min.b)
					}:o.color.color;
					e.half=o.duration.duration/2;
				}
			}
			else if(o.dir.rand&&o.step>0&&(o.step%60)==0&&Math.floor(Math.random()*2)==1){
				randomdir();
			}
			o.alpha=o.opacity.animation?o.opacity.decay?o.step<e.half?((o.step/e.half)*o.opacity.opacity):((o.duration.duration-o.step)/e.half)*o.opacity.opacity:o.alpha<o.opacity.opacity-.1?(o.step/o.duration.duration)*o.opacity.opacity:o.opacity.opacity:o.opacity.opacity;
			o.alpha=o.alpha<0?0:o.alpha;
			o.position.x=o.dir.xfunction(o.dir.x,o.position.x,o.dir.y,o.position.y,o.speed.speed,data.canvas.width,data.canvas.height,o.step);
			o.position.y=o.dir.yfunction(o.dir.x,o.position.x,o.dir.y,o.position.y,o.speed.speed,data.canvas.width,data.canvas.height,o.step);	
			if(o.bound=="back"){
				o.position.x=o.position.x>data.canvas.width+o.radius.radius+2?-o.radius.radius:(o.position.x<-(o.radius.radius+2))?data.canvas.width+o.radius.radius:o.position.x;
				if(!o.image){
					o.position.y=o.position.y>data.canvas.height+o.radius.radius+2?-o.radius.radius:(o.position.y<-(o.radius.radius+2))?data.canvas.height+o.radius.radius:o.position.y;
				}
				else{
					o.position.y=o.position.y>data.canvas.height+o.radius.radius*o.image.height/o.image.width+2?-o.radius.radius*o.image.height/o.image.width:(o.position.y<-(o.radius.radius*o.image.height/o.image.width+2))?data.canvas.height+o.radius.radius*o.image.height/o.image.width:o.position.y;	
				}
			}
			else if(o.bound=="bounce"){
				if(o.position.x+o.radius.radius>=data.canvas.width){
					o.position.x+=-o.speed.speed;
					o.dir.x=-1;
				}
				else if(o.position.x<=o.radius.radius){
					o.position.x+=o.speed.speed;
					o.dir.x=1;
				}
				if(!o.image){
					if(o.position.y+o.radius.radius>=data.canvas.height){
						o.position.y+=-o.speed.speed;
						o.dir.y=-1;
					}
					else if(o.position.y<=o.radius.radius){
						o.position.y+=o.speed.speed;
						o.dir.y=1;
					}
				}
				else{
					if(o.position.y+o.radius.radius*o.image.height/o.image.width>=data.canvas.height){
						o.position.y+=-o.speed.speed;
						o.dir.y=-1;
					}
					else if(o.position.y<=o.radius.radius*o.image.height/o.image.width){
						o.position.y+=o.speed.speed;
						o.dir.y=1;
					}
				}
			}
			if(o.image){
				data.canvas.ctx.save();
				data.canvas.ctx.translate(o.position.x, o.position.y);
				data.canvas.ctx.globalAlpha=o.alpha;
				data.canvas.ctx.drawImage(o.image,-o.radius.radius,-o.radius.radius*o.image.height/o.image.width,o.radius.radius*2,(o.radius.radius*2)*o.image.height/o.image.width);
				data.canvas.ctx.restore();
			}
			else{
				data.canvas.ctx.beginPath();
				data.canvas.ctx.arc(o.position.x,o.position.y,o.radius.radius,0,pi, false);
				data.canvas.ctx.fillStyle = "rgba("+o.color.color.r+","+o.color.color.g+","+o.color.color.b+","+o.alpha+")";
				data.canvas.ctx.fill();
			}
			o.step++;
		}
		if(isFunction(data.addParticle)){
			ele.addEventListener("addParticle.particles",data.addParticle);
		}
		ele.dispatchEvent(new CustomEvent("addParticle.particles",{"detail":{"added":o}}));
		if($.fn.particles){
			$(ele).trigger({type:"addParticle.particles",detail:{"added":o}});
		}
		data.part.push(o);
	}
	
	particles.prototype.stop=function(){
		var data=this,ele=data.element;
		if(data.state=="playing"){
			data.state="stopped";
			cancelAnimationFrame(data.requestid);
		}else{
			data.state="playing";
			data.step();
		}
		if(isFunction(data.stateChange)){
			ele.addEventListener("stateChange.particles",data.stateChange);
		}
		ele.dispatchEvent(new CustomEvent("stateChange.particles",{"detail":{"state":data.state}}));
	}
	
	particles.prototype.step=function(){
		var data=this,ele=data.element,rarray;
		if(data&&data.state=="playing"){
			rarray=[];
			data.canvas.ctx.clearRect(0,0,data.canvas.width,data.canvas.height);
			var length=data.part.length,n;
			for (var i=0;i<length;i++){
				n=data.part[i];
				n.update();
				if(!n.remove){
					rarray.push(n);
				}
				else{
					if(isFunction(data.removeParticle)){
						ele.addEventListener("removeParticle.particles",data.removeParticle);
					}
					ele.dispatchEvent(new CustomEvent("removeParticle.particles",{"detail":{"removed":n}}));
					if($.fn.particles){
						$(ele).trigger({type:"removeParticle.particles",detail:{"removed":n}});
					}
				}
			}
			if(data){
				data.part=rarray;
				data.requestid=requestAnimationFrame(function(){
				  data.step();
				});
			}
		}
	}
	
	particles.prototype.destroy=function(){
		var data=this,ele=data.element;
		data.stop();
		if(isFunction(data.removeParticle)){
			ele.removeEventListener("removeParticle.particles",data.removeParticle);
		}		
		if(isFunction(data.stateChange)){
			ele.removeEventListener("stateChange.particles",data.stateChange);
		}
		if(isFunction(data.addParticle)){
			ele.removeEventListener("addParticle.particles",data.addParticle);
		}
		if(isFunction(data.create)){
			ele.removeEventListener("create.particles",data.create);
		}
		ele.removeChild(data.canvas.object);
		delete data;
	}
}());
