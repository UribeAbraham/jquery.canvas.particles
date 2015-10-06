$(window).load(function(){

$("#rec1").particles({
	amount:10,
	duration:{random:true},
	speed:{speed:1},
	layout:"after",
	color:{random:true}
}).click(function(){
	$(this).particles("stop");
}).on("stateChange.particles",function(event){
	console.log(event.detail.state);
});

$("#rec2").particles({
	amount:2,
	end:"change",
	dir:{randomx:true,randomy:true},
	opacity:{decay:false,animation:false},
	duration:{duration:5000},
	speed:{speed:1,random:true},
	radius:{random:false,radius:10},
	color:{color:{r:200,g:0,b:200},random:true,min:{r:200,g:200,b:0}},
	bound:"bounce"
}).click(function(e){
	var pos={x:e.pageX-$(this).offset().left,y:e.pageY-$(this).offset().top};
	$(this).particles("add",{
		position:pos,
		radius:{radius:3,random:true},
		duration:{duration:7000},
		speed:{speed:1}
	});
});

$("#rec3").particles({
	amount:10,
	radius:{radius:10,random:true},
	opacity:{decay:true,animation:true},
	duration:{duration:10000,random:true,firststep:-2000},
	speed:{speed:.5,random:true},
	end:"remove",
	position:{x:100,y:60},
	color:{color:{r:0,g:100,b:150},random:true,min:{r:0,g:50,b:100}}
}).click(function(){
	var imgrandom=Math.floor(Math.random()*3);
	$(this).particles("add",{
		position:{random:true},
		color:{
			color:{r:123}
		},
		radius:{radius:10},
		duration:{duration:10000},
		speed:{speed:2},
		opacity:{animation:false,decay:false},
		image:imgrandom==0?"images/1.png":imgrandom==1?"images/2.png":"images/3.png",
		end:"change",bound:"bounce"
	});
});	

$("#rec4").click(function(){
	if(!this.particlesData){
		$(this).particles({
			amount:10,
			radius:{radius:10,random:true},
			opacity:{decay:true,animation:true},
			duration:{duration:10000,random:true,firststep:-1000},
			speed:{speed:1.5,random:true},
			end:"remove",
			position:{x:0,y:0},
			color:{color:{r:0,g:0,b:150},random:true,min:{r:0,g:0,b:100}},
			dir:{
				x:1,
				y:1,
				xrand:false,
				yrand:true,
				rand:true
			},
			create:function(){
				console.log("created "+$(this).attr("id")+" particles");
			}
		});
	}
}).on("create.particles",function(){
	console.log("on create rec4");
}).on("removeParticle.particles",function(){
	if(this.particlesData.part.length-1==0){
		$(this).particles("destroy");
	}
});

$("#rec5").click(function(){
	var position={x:$(this).width(),y:$(this).height()};
	if(this.particlesData&&this.particlesData.part.length==0){
		$(this).particles("destroy");
	}
	if(!this.particlesData){
		$(this).particles({
			amount:10,
			radius:{radius:10,random:true},
			opacity:{decay:true,animation:true},
			duration:{duration:10000,random:false,firststep:-1000},
			speed:{speed:3.5,random:true,min:1},
			end:"remove",
			position:position,
			color:{color:{r:0,g:100,b:0}},
			dir:{
				x:-1,
				y:-1,
				xrand:false,
				yrand:false,
				rand:false,
				xfunction:function(dx,px,dy,py,s,w,h,step){
					return 175+50*Math.cos(2*Math.PI*(step*s)/600)
				},
				yfunction:function(dx,px,dy,py,s,w,h,step){
					return 100+50*Math.sin(2*Math.PI*(step*s)/600)
				}
			}
		});
	}
}).on("create.particles",function(){
	console.log("created rec5 particles");
}).on("addParticle.particles",function(event){
	console.log("created particle on rec5");
});

$("#rec6").click(function(){
	if(!this.particlesData){
		$(this).particles({
			amount:0,
			radius:{radius:10,random:false},
			opacity:{decay:false,animation:false},
			duration:{duration:3000,random:false,firststep:0},
			speed:{speed:3,random:true,min:2},
			position:{x:0,y:0},
			image:"images/4.png",
			dir:{
				x:1,
				y:1,
				xrand:false,
				yrand:false,
				rand:false,
				xfunction:function(dx,px,dy,py,s,w,h,step){
					if(px<w){
						return px+=dx*s
					}
					else{
						return px==-200
					}
				},
				yfunction:function(dx,px,dy,py,s,w,h,step){
					if(py<h+100){
						return py+=dy*s
					}
					else{
						return py==-50
					}
				}
			},
			bound:false,
			layout:"after",
			create:function(){console.log("created "+$(this).attr("id"))}
		});
		for(var i=0;i<50;i++){
			$(this).particles("add",{
				radius:{radius:Math.random()*10+2},
				speed:{speed:Math.random()*1+2},
				position:{x:Math.random()*$(this).width(),y:Math.random()-400}
			});
		}
	}
});

	prettyPrint();
    $(".prettyprint").each(function(){
			var swidth=$(this)[0].scrollWidth;
                        swidth=swidth-28;
			$(this).find(".linenums").css({"width":swidth+"px"});

    });

});
