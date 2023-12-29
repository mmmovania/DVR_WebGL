//A simple utility class for creating a simple transfer function editor
//Author: Dr. Muhammad Mobeen Movania

function TF_Editor(left,top, width, height, pattern) 
{
	this.tfLeft = left;
    this.tfTop  = top;
    this.tfWidth = width;
    this.tfHeight = height;
        
	this.ptSize = 4;     
    this.intPoint = -1; 
    this.offset = 2;
    this.color_sample_height = 14;        
    this.lastPoint=-1;
    this.pattern=pattern;
    this.isDragging = false;
	this.isPicking = false;    
	
	this.points = [];
	this.custom_tf_points = [];
	this.TF_Presets = Object.freeze({CUSTOM:0,
									 FIRE:1, 
									 GRAY:2, 
									 JET:3,
									 MEVIS:4,
									 VIRIDIS:5 });

    //this.addPoint(this.tfLeft, 'rgba(0,0,0,0.0)'); 
	//this.addPoint(this.tfLeft+ this.tfWidth,'rgba(255,255,255,1)');
	
	this.custom_tf_points.push(new point2D(this.tfLeft,'rgba(0,0,0,0.0)', this.tfLeft, this.tfTop, this.tfWidth, this.tfHeight));
	this.custom_tf_points.push(new point2D(this.tfLeft+ this.tfWidth,'rgba(255,255,255,1.0)', this.tfLeft, this.tfTop, this.tfWidth, this.tfHeight));
} 



function point2D(x,color, left, top, width, height) 
{
	var alpha=color.replace(/^.*,(.+)\)/,'$1');
	this.x = x; 
	this.y = top+ height*(1.0-alpha);
    this.color=color; 
    this.scale=parseFloat(x-left)/width;
}			       

function sortFunc(a,b) 
{
	return a.x-b.x;
}

function findWithAttr(array, value) 
{
	for(let i = 0; i < array.length; i += 1) 
	{
		if(array[i].x === value) 
		{
			return i;
		}
	}
	return -1;
}
TF_Editor.prototype.loadPreset = function(preset)
{
	this.points=[];
		
	switch(preset)
	{
		case this.TF_Presets.FIRE:
		this.addPoint(this.tfLeft, 						'rgba(  0,  0,  0,0.0)');
		this.addPoint(this.tfLeft+ 0.33*this.tfWidth, 	'rgba(255,  0,  0,0.33)');
		this.addPoint(this.tfLeft+ 0.66*this.tfWidth,   'rgba( 255,255, 0,0.66)');
		this.addPoint(this.tfLeft+ this.tfWidth, 		'rgba(255,255,255,1.0)');
		break;
		
		case this.TF_Presets.CUSTOM:
		this.points = [...this.custom_tf_points];
		break;
		
		case this.TF_Presets.GRAY:		
		this.addPoint(this.tfLeft, 'rgba(0,0,0,0.0)'); 
		this.addPoint(this.tfLeft+ this.tfWidth,'rgba(255,255,255,1)');
		break;
		
		case this.TF_Presets.JET:
		this.addPoint(this.tfLeft, 						'rgba(  0,  0, 50,0.0)');
		this.addPoint(this.tfLeft+ 0.2*this.tfWidth, 	'rgba(  0,  0,255,0.2)');
		this.addPoint(this.tfLeft+ 0.4*this.tfWidth,    'rgba(  0,255,255,0.4)');
		this.addPoint(this.tfLeft+ 0.6*this.tfWidth,    'rgba(  0,255,  0,0.6)');
		this.addPoint(this.tfLeft+ 0.8*this.tfWidth, 	'rgba(255,255,  0,0.8)');
		this.addPoint(this.tfLeft+ this.tfWidth, 		'rgba(255,  0,  0,1.0)');
		break;
		
		case this.TF_Presets.MEVIS:
		//MeVis
		//X: 0 		 -> 0 36 122 0
		//X: 640.868 -> 56 56 148 0 
		//X: 1322.34 -> 194 31 93 0.074
		//X: 3352.78 -> 224 218 60 1
		//X: 4095    -> 255 240 105 1
		this.addPoint(this.tfLeft, 						'rgba(0,36,122,0.0)');
		this.addPoint(this.tfLeft+ 0.156*this.tfWidth, 	'rgba(56,56,148,0.0)');
		this.addPoint(this.tfLeft+ 0.323*this.tfWidth,  'rgba(194,31,93,0.074)');
		this.addPoint(this.tfLeft+ 0.819*this.tfWidth,  'rgba(224,218,60,1.0)');
		this.addPoint(this.tfLeft+ this.tfWidth, 		'rgba(255,240,105,1.0)');
		
		/*this.addPoint(this.tfLeft, 						'rgba(0,36,122,0.0)');
		this.addPoint(this.tfLeft+ 0.25*this.tfWidth, 	'rgba(56,56,148,0.25)');
		this.addPoint(this.tfLeft+ 0.5*this.tfWidth,  'rgba(194,31,93,0.5)');
		this.addPoint(this.tfLeft+ 0.75*this.tfWidth,  'rgba(224,218,60,0.75)');
		this.addPoint(this.tfLeft+ this.tfWidth, 		'rgba(255,240,105,1.0)');
		*/
		break;
		
		case this.TF_Presets.VIRIDIS:
		//68 1 85
		//71 43 123
		//59 81 139
		//44 114 143
		//32 144 141
		//38 174 129
		//92 202 99
		//171 221 49
		//255 233 36
		this.addPoint(this.tfLeft, 						'rgba(68,1,85,0.0)');
		this.addPoint(this.tfLeft+ 0.125*this.tfWidth, 	'rgba(71,43,123,0.125)');
		this.addPoint(this.tfLeft+ 0.25*this.tfWidth,    'rgba(59,81,139,0.25)');
		this.addPoint(this.tfLeft+ 0.375*this.tfWidth,   'rgba(44,114,143,0.375)');
		this.addPoint(this.tfLeft+ 0.5*this.tfWidth, 		'rgba(32,144,141,0.5)');
		this.addPoint(this.tfLeft+ 0.625*this.tfWidth, 		'rgba(38,174,129,0.625)'); 
		this.addPoint(this.tfLeft+ 0.75*this.tfWidth, 		'rgba(92,202,99,0.75)'); 
		this.addPoint(this.tfLeft+ 0.875*this.tfWidth, 		'rgba(171,221,49,0.875)'); 
		this.addPoint(this.tfLeft+ this.tfWidth, 		'rgba(255,233,36,1.0)'); 
		
		break;
		
		 
	}
}

TF_Editor.prototype.setPicking = function(state)
{
	this.isPicking = state;
}

TF_Editor.prototype.addPoint = function(x, color) 
{
	this.points.push(new point2D(x,color, this.tfLeft, this.tfTop, this.tfWidth, this.tfHeight));
}

TF_Editor.prototype.calcScale=function(p) 
{
	p.scale=parseFloat(p.x-this.tfLeft)/this.tfWidth;
}

TF_Editor.prototype.onMouseMove=function(event, mouseX, mouseY, dy)
{
	if(this.isPicking)
		return;
			   
	if(this.intPoint!=-1) //we have a node selected
	{ 
		if(mouseX>=this.tfLeft && mouseX<=(this.tfLeft+this.tfWidth) )  
		{
			if(this.intPoint != 0 && this.intPoint != (this.points.length-1) )
				this.points[this.intPoint].x = mouseX;
				   			  
			this.calcScale(this.points[this.intPoint]);

			if((this.points[this.intPoint].y+dy) >=this.tfTop && (this.points[this.intPoint].y+dy)<=(this.tfTop+this.tfHeight))
				this.points[this.intPoint].y += dy;
		}
	} 
	else //there is no node selected
	{
		if(mouseX>=this.tfLeft && mouseX<=(this.tfLeft+this.tfWidth) && mouseY >= this.tfTop && mouseY <= (this.tfTop+this.tfHeight+this.offset) )
		{				
			if(this.isDragging )
			{  
				var col = new RGBColor(document.getElementById('colorPicker').color.toString());
				var alpha = parseFloat(this.tfTop+this.tfHeight-mouseY)/this.tfHeight;
				this.addPoint(mouseX, "rgba("+ col.r +","+ col.g +","+col.b+","+alpha+ ")");
				this.points.sort(sortFunc); 
						 	 	        						
				this.isDragging = false;
				this.intPoint = findWithAttr(this.points, mouseX); 
				this.lastPoint = this.intPoint;  
			}
		}
	}
}

TF_Editor.prototype.onMouseUp=function(event)
{
	if(this.intPoint!=-1)
		this.lastPoint = this.intPoint;
	this.intPoint  = -1;   	     		
	this.isDragging = false;    
} 
 

TF_Editor.prototype.onMouseDown=function(event, mouseX, mouseY)
{
	this.intPoint =-1;
    if(	mouseX < this.tfLeft-2 || 
		mouseX > (this.tfLeft+this.tfWidth+4) || 
		mouseY < this.tfTop-2 || 
		mouseY > (this.tfTop+this.tfHeight+this.offset+4) )
		return;
	
	if(event.button != 1 ) 
	{ 
		for(let i=0;i<this.points.length;i++)
		{    	 	        
 	        if(	Math.abs(this.points[i].x-mouseX) <= this.ptSize  && 
				Math.abs(this.points[i].y-mouseY) <= this.ptSize) 
			{ 
				this.intPoint = i; 
				let tcol = this.points[i].color;				
    	 	    let rgb = tcol.substr(4,tcol.lastIndexOf(",")-4);
    	 	    let col = new RGBColor("RGB"+rgb+")");
    	 	    if(col.ok)  
					document.getElementById('colorPicker').color.fromRGB(col.r/255, col.g/255, col.b/255);
				 
				break;
		    }
    	}
		
		if( this.intPoint == -1 )
		{
			let col = new RGBColor(document.getElementById('colorPicker').color.toString());
			let alpha = parseFloat(this.tfTop+this.tfHeight-mouseY)/this.tfHeight;
			this.addPoint(mouseX, "rgba("+ col.r +","+ col.g +","+col.b+","+alpha+ ")");
			this.points.sort(sortFunc); 
			this.intPoint = findWithAttr(this.points, mouseX); 
			this.lastPoint = this.intPoint;  
		}
    }  
    if(event.button == 2) 
	{   	 	     
        if(this.intPoint!=-1 && this.intPoint!=0 && this.intPoint!= (this.points.length-1)) 
		{
    	    this.points.splice(this.intPoint, 1);
    	 	this.intPoint = -1;
		}
 	}  		
 
	this.isDragging = (event.button==0 && this.isPicking==false);	
}

TF_Editor.prototype.getImageData = function(ctx)
{
	let imgData = ctx.getImageData(this.tfLeft, this.tfTop+this.tfHeight+this.offset,  this.tfWidth,  this.color_sample_height);
	ctx.putImageData(imgData, 10,10);
}
TF_Editor.prototype.copyTextureToContextData=function(data)
{ 
	let count = 0;
	let indices = new Array(this.points.length); 
    let data2 = new Array(256*4);

    //clear to 0
	for(let i=0;i<256*4;i++) {
	    data2[i] = 0;
	}

	for(let i = 0; i < this.points.length; i++) 
	{
		let x = this.points[i].x; 
		let y = this.points[i].y; 
		let s = this.points[i].scale;
		let color = this.points[i].color;
                
        //process color to add in the alpha
        //var rgb = color.substring(0,color.lastIndexOf(","));               
        //color = (rgbComp+","+alpha+")");
		
	    let lastCommaIndex = color.lastIndexOf(",");
	    let rgb = color.substr(4,lastCommaIndex-4);
        
		let alpha = 1.0- (parseFloat(y-this.tfTop)/this.tfHeight);
    	let col = new RGBColor("RGB"+rgb+")");
        let index = parseInt(s * 256);
	    data2[index*4+0] = col.r;
	    data2[index*4+1] = col.g;
	    data2[index*4+2] = col.b;
	    //data2[index*4+3] = alpha;
	    data2[index*4+3] = alpha*255;

	    indices[count++]=index;
	}

    //interpolate
	for (let j = 0; j < this.points.length-1; j++) {
	    let dDataR =  (data2[indices[j+1]*4+0] - data2[indices[j]*4+0]);
	    let dDataG =  (data2[indices[j+1]*4+1] - data2[indices[j]*4+1]);
	    let dDataB =  (data2[indices[j+1]*4+2] - data2[indices[j]*4+2]);
	    let dDataA =  (data2[indices[j+1]*4+3] - data2[indices[j]*4+3]);

		let dIndex = indices[j+1]-indices[j];
		let dDataIncR = dDataR/dIndex;
		let dDataIncG = dDataG/dIndex;
		let dDataIncB = dDataB/dIndex;
		let dDataIncA = dDataA/dIndex;

		for(let i=indices[j]+1;i<indices[j+1];i++)
		{
		    data2[i*4+0]=(data2[(i-1)*4+0]+dDataIncR);
		    data2[i*4+1]=(data2[(i-1)*4+1]+dDataIncG);
		    data2[i*4+2]=(data2[(i-1)*4+2]+dDataIncB);
		    data2[i*4+3]=(data2[(i-1)*4+3]+dDataIncA);
		}
	}

	for(let i=0;i<256*4;i++) 
	{
	    data[i] = parseInt(data2[i]);
	}
}

TF_Editor.prototype.copyCustomPoints=function()
{
	this.custom_tf_points = [...this.points];
}

TF_Editor.prototype.copyTextureToContext=function(ctx, width, height)
{ 
	ctx.clearRect (0, 0 , width , height ); 	
	  
	let lingrad=ctx.createLinearGradient(0,0,width, 0);	
	 
	//draw the color markers 
    for(let i=0;i<this.points.length;i++) 
	{
        let x = this.points[i].x; 
		let y = this.points[i].y; 
		let s = this.points[i].scale;
		
        let alpha = 1.0- (parseFloat(y-this.tfTop)/this.tfHeight);
        let color = this.points[i].color;
                
        //process color to add in the alpha
        let rgbComp = color.substring(0,color.lastIndexOf(","));               
        color = (rgbComp+","+alpha+")");
		
        lingrad.addColorStop(s, color);  
    }            
            
    ctx.fillStyle=lingrad;
    ctx.fillRect(0, 0,  width,  height);
}

TF_Editor.prototype.copyTextureTo1DContext=function(ctx, width)
{
	//ctx.clearRect (0, 0 , width , height );
	let lingrad = ctx.createLinearGradient(0,width);	
	
	  //draw the color markers 
    for(let i=0;i<this.points.length;i++) 
	{
        let x = this.points[i].x; 
		let y = this.points[i].y; 
		let s = this.points[i].scale;
		
        let alpha = 1- (this.points[i].y-this.tfTop)/this.tfHeight;
        let color = this.points[i].color;
                
        //process color to add in the alpha
        let rgbComp = color.substring(0,color.lastIndexOf(","));               
        color = (rgbComp+","+alpha+")");
		
        lingrad.addColorStop(s, color);  
    }            
            
    ctx.lineStyle=lingrad;
    ctx.drawLine(0, width);
}

TF_Editor.prototype.draw=function(ctx)
{
	ctx.clearRect (0, 0 ,  this.tfWidth,  this.tfHeight);
	
	ctx.strokeStyle = 'black';
    ctx.strokeRect(this.tfLeft, this.tfTop,  this.tfWidth,  this.tfHeight);
			
	ctx.strokeStyle = 'gray';
	ctx.strokeRect(this.tfLeft-5, this.tfTop-5,  this.tfWidth+10,  this.tfHeight+this.color_sample_height+10);
            
    //fill the background with checker pattern
    ctx.fillStyle=this.pattern; 	 	
    ctx.fillRect(this.tfLeft, this.tfTop+this.tfHeight+this.offset,  this.tfWidth,  this.color_sample_height);
    //ctx.fillRect(this.tfLeft, this.tfTop,  this.tfWidth,  this.tfHeight);
 
    //draw lines 
	ctx.beginPath();
	for(let i=0;i<this.points.length-1;i++) 
	{
		let x0 = this.points[i].x;
		let y0 = this.points[i].y;
		let x1 = this.points[i+1].x;
		let y1 = this.points[i+1].y;
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
	}
          
    let lingrad=ctx.createLinearGradient(0,0,this.tfWidth,  0);
                
    //draw the color markers 
    for(let i=0;i<this.points.length;i++) 
	{
        let x = this.points[i].x; 
		let y = this.points[i].y; 
		let s = this.points[i].scale;
		
        let alpha = 1.0- (parseFloat(y-this.tfTop)/this.tfHeight);
        let color = this.points[i].color;
                
        //process color to add in the alpha
        let rgbComp = color.substring(0,color.lastIndexOf(","));               
        color = (rgbComp+","+alpha+")");
                  
                 
		//as a point 
		ctx.beginPath();
		ctx.arc(x,y, this.ptSize, 0, 2 * Math.PI, false);		
		ctx.fillStyle = (rgbComp+",1)");
		ctx.fill(); 		
		ctx.strokeStyle = (this.intPoint==i)?'rgb(0,255,255)':'black';		
		ctx.stroke();
		
        lingrad.addColorStop(s, color);  
    }            
            
    ctx.fillStyle=lingrad;
    ctx.fillRect(this.tfLeft, this.tfTop+this.tfHeight+this.offset,  this.tfWidth,  this.color_sample_height);
}