$.fn.particles=function(method){
	var pi=2*Math.PI;
	var frames=1000/60;
	var defaults={
		amount:10,
		stop:false,
		end:"change",
		dir:{
			x:1,
			y:1,
			xrand:true,
			yrand:true,
			rand:true
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
		layout:"before"
	};
	var requestAnimFrame=(function(callback){
		return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||
			function(callback){
				window.setTimeout(callback,frames);
			};
	})();
	var methods={
		init:function(opt){
			opt=$.extend(true,{},defaults,opt||{});
			return this.each(function(){
				var el=$(this);
				var o=$.extend({},opt);
				if(o.image){
					var src=o.image;
					o.image=new Image();
					o.image.src=src;
				}
				o.part=[];
				o.canvas={};
				o.canvas.cw=el.width();
				o.canvas.ch=el.height();
				var canvas=$("<canvas class='particles' width='"+o.canvas.cw+"' height='"+o.canvas.ch+"'></canvas>");
				if(o.layout=="before"){
					el.append(canvas);
				}
				else if(o.layout=="after"){
					el.prepend(canvas);
				}
				var ctx = canvas.get(0).getContext("2d");
				o.canvas.ctx=ctx;
				o.canvas.co=canvas;
				this.parts=o;
				for(var i=0;i<o.amount;i++){
					var rand=Math.random();
					el.particles("addParticle",{
						position:{
							x:o.position.random?parseInt(Math.random()*o.canvas.cw):o.position.x,
							y:o.position.random?parseInt(Math.random()*o.canvas.ch):o.position.y
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
				methods["step"].apply(el);
			});
		},
		addParticle:function(p){
			return this.each(function(){			
				var defaults=this.parts;
				var o={
					color:$.extend(true,{},defaults.color,p.color||{}),
					duration:$.extend(true,{},defaults.duration,p.duration||{}),
					end:p.end?p.end:defaults.end,
					image:p.image?p.image:defaults.image,
					opacity:$.extend(true,{},defaults.opacity,p.opacity||{}),
					radius:$.extend(true,{},defaults.radius,p.radius||{}),
					speed:$.extend(true,{},defaults.speed,p.speed||{}),
					position:$.extend(true,{},defaults.position,p.position||{}),
					dir:$.extend(true,{},defaults.dir,p.dir||{}),
					alpha:0
				};
				var randomdir=function(){
					o.dir.x=(o.dir.xrand)?(parseInt(Math.random()*2)==0)?Math.random()+.1:(Math.random()*-1)-.1:o.dir.x;
					o.dir.y=(o.dir.yrand)?(parseInt(Math.random()*2)==0)?Math.random()+.1:(Math.random()*-1)-.1:o.dir.y;
				};
				if(o.image&&!o.image.src){
					var src=o.image;
					o.image=new Image();
					o.image.src=src;
				}
				o.position=p.position&&p.position.random?{x:parseInt(Math.random()*defaults.canvas.cw),y:parseInt(Math.random()*defaults.canvas.ch),random:true}:o.position;
				o.duration.duration=parseInt(o.duration.duration/frames);
				o.duration.firststep=parseInt(o.duration.firststep/frames);
				o.duration.min=parseInt(o.duration.min/frames);
				o.step=o.duration.firststep;
				randomdir();
				var e={
					half:o.duration.duration/2,
					min:parseInt(defaults.duration.min/frames),
					duration:parseInt(defaults.duration.duration/frames),
					radius:defaults.radius.radius-defaults.radius.min,
					speed:defaults.speed.speed-defaults.speed.min,
					opacity:defaults.opacity.opacity-defaults.opacity.min
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
							var rand=Math.random();
							o.duration.duration=o.duration.random?parseInt(Math.random()*e.max)+e.min:e.duration;
							o.radius.radius=o.radius.random?(Math.random()*e.radius)+defaults.radius.min:defaults.radius.radius;
							o.speed.speed=o.speed.random?(Math.random()*e.speed)+defaults.speed.min:defaults.speed.speed;
							o.opacity.opacity=o.opacity.random?(Math.random()*e.opacity)+defaults.opacity.min:defaults.opacity.opacity;
							o.color.color=o.color.random?{
								r:parseInt(rand*(defaults.color.color.r-defaults.color.min.r)+defaults.color.min.r),
								g:parseInt(rand*(defaults.color.color.g-defaults.color.min.g)+defaults.color.min.g),
								b:parseInt(rand*(defaults.color.color.b-defaults.color.min.b)+defaults.color.min.b)
							}:o.color.color;
							e.half=o.duration.duration/2;
						}
					}
					else if(o.dir.rand&&o.step>0&&(o.step%60)==0&&Math.floor(Math.random()*2)==1){
						randomdir();
					}
					o.alpha=o.opacity.animation?o.opacity.decay?o.step<e.half?((o.step/e.half)*o.opacity.opacity):((o.duration.duration-o.step)/e.half)*o.opacity.opacity:o.alpha<o.opacity.opacity-.1?(o.step/o.duration.duration)*o.opacity.opacity:o.opacity.opacity:o.opacity.opacity;
					o.alpha=o.alpha<0?0:o.alpha;
					o.position.x+=(o.dir.x*o.speed.speed);
					o.position.y+=(Math.sin(pi*(o.position.x/defaults.canvas.cw))*(o.dir.y*o.speed.speed));
					o.position.x=o.position.x>defaults.canvas.cw+o.radius.radius+2?-o.radius.radius:(o.position.x<-(o.radius.radius+2))?defaults.canvas.cw+o.radius.radius:o.position.x;
					o.position.y=o.position.y>defaults.canvas.ch+o.radius.radius+2?-o.radius.radius:(o.position.y<-(o.radius.radius+2))?defaults.canvas.ch+o.radius.radius:o.position.y;
					if(o.image){
						defaults.canvas.ctx.save();
						defaults.canvas.ctx.translate(o.position.x, o.position.y);
						defaults.canvas.ctx.globalAlpha=o.alpha;
						defaults.canvas.ctx.drawImage(o.image,-o.radius.radius,-o.radius.radius,o.radius.radius*2,(o.radius.radius*2)*o.image.height/o.image.width);
						defaults.canvas.ctx.restore();
					}
					else{
						defaults.canvas.ctx.beginPath();
						defaults.canvas.ctx.arc(o.position.x,o.position.y,o.radius.radius,0,pi, false);
						defaults.canvas.ctx.fillStyle = "rgba("+o.color.color.r+","+o.color.color.g+","+o.color.color.b+","+o.alpha+")";
						defaults.canvas.ctx.fill();
					}
					o.step++;
				}
				defaults.part.push(o);
			});
		},
		stopParticles:function(){
			return this.each(function(){
				var el=this;
				if(el.parts.stop==false){
					el.parts.stop=true;
				}else{
					el.parts.stop=false;
					methods["step"].apply($(el));
				}
			});
		},
		step:function(){
			return this.each(function(){
				var el=this;
				if(el.parts.stop==false){
					var rarray=[];
					el.parts.canvas.ctx.clearRect(0,0,el.parts.canvas.cw,el.parts.canvas.ch);
					$.each(el.parts.part,function(i,n){
						n.update();
						if(!n.remove){
							rarray.push(n);
						}
					});
					el.parts.part=rarray;
					requestAnimFrame(function(){
					  methods["step"].apply($(el));
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
		$.error('Method '+method+' does not exist on jQuery.particles');
    }
};
