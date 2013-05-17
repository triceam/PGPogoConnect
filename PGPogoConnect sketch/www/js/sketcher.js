

function Sketcher( canvasID, brushImage ) {
	this.brush = brushImage;
	this.canvasID = canvasID;
	this.canvas = document.getElementById( canvasID );
	this.context = canvas.getContext("2d");
	this.context.strokeStyle = "#000000";
	this.context.lineWidth = 3;
	this.eraserImage = null;

    this.minSize = 0.2;
    this.maxSize = 0.5;

    this.minOpacity = 0.2;
    this.maxOpacity = 0.5;
    
    this.renderData = [];
    this.requestedRedraw = false;
    this.eraseMode = false;
}

Sketcher.prototype.resizeContext = function () {

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    console.log( "window.devicePixelRatio: " + window.devicePixelRatio );
    if ( window.devicePixelRatio == undefined ) {
        window.devicePixelRatio = 1;
    }
    console.log( "window.devicePixelRatio: " + window.devicePixelRatio );

    this.context.width  = window.innerWidth*window.devicePixelRatio;
    this.context.height = window.innerHeight*window.devicePixelRatio;
    this.context.scale( 1/window.devicePixelRatio, 1/window.devicePixelRatio );

    //console.log( window.innerWidth + " " + window.innerHeight)
}

Sketcher.prototype.requestRedraw = function() {
    if ( this.requestedRedraw != true ){
        this.requestedRedraw = true;
        var self = this;
        window.requestAnimationFrame( function(){
            self.render();
            self.requestedRedraw = false;
        });
    }
}


Sketcher.prototype.toggleEraseMode = function() {

    for ( var key in this.renderData ) {
        this.renderData[ key ] = [];
    }
    this.eraseMode = !this.eraseMode;
}

Sketcher.prototype.drawBegin = function (data) {

    if (this.renderData[ data.id ] != undefined && this.renderData[ data.id ].length > 1) {
        this.drawMove( data );
    }
    else {
        var drawData = [data, data];
        this.renderData[ data.id ] = drawData;
        this.requestRedraw();
    }

}


Sketcher.prototype.drawMove = function (data) {

    //var lastData
    //var drawData = [data, data];
    //console.log( "drawMove: " + data.id + " " + this.renderData[ data.id ].length );
    if ( this.renderData[ data.id ] == undefined ) {
        return  this.drawBegin(data);
    }
    this.renderData[ data.id ].push(data);
    this.requestRedraw();
}


Sketcher.prototype.clear = function (id) {

    this.renderData[ id ] = [];

}
                           
Sketcher.prototype.render = function () {

    if ( this.eraseMode ) {
        this.context.globalCompositeOperation = "destination-out";
    }
    else {
        this.context.globalCompositeOperation = "source-over";
    }

    //alert( "render" );
    for ( var key in this.renderData ) {
        var points = this.renderData[ key ];
        if (points.length > 1 ) {
            for ( var i=0; i<points.length-1; i++ )
            {
                this.renderBrushLine( points[i], points[i+1] );
            }
            this.renderData[ key ] = [ points[points.length-1] ];
        }
    }
}
                           
                 
Sketcher.prototype.renderBrushLine = function (start, end) {

    var halfBrushW = (this.brush.width/2);
    var halfBrushH = (this.brush.height/2);
                           
    var distance = Trig.distanceBetween2Points( start, end );
    var angle = Trig.angleBetween2Points( start, end );

    var pressureDiffIncrement = (end.pressure - start.pressure)/distance;
                           
    var x, y, pressure, normalizedPressure, alpha, brushW, brushH;


    for ( var z=0; (z<=distance || z==0); z += 1 ) {

        pressure = (start.pressure + (z*pressureDiffIncrement));
        brushSizePressure = this.getNormalizedSize(pressure);

        brushW = halfBrushW * brushSizePressure;
        brushH = halfBrushH * brushSizePressure;

        this.context.globalAlpha = this.getNormalizedOpacity(pressure);

        x = start.x + (Math.sin(angle) * z);
        y = start.y + (Math.cos(angle) * z);

        x*= window.devicePixelRatio;
        y*= window.devicePixelRatio;

        x -= brushW;
        y -= brushH;

        //console.log(x + ", " + y + ", " + z + ", " + distance)
        this.context.drawImage(this.brush, x, y, this.brush.width*brushSizePressure, this.brush.height*brushSizePressure);

    }
}

Sketcher.prototype.getNormalizedOpacity = function (pressure) {
    var diff = this.maxOpacity - this.minOpacity;
    return (this.minOpacity + (diff * pressure)) * 0.8;
}

Sketcher.prototype.getNormalizedSize = function (pressure) {
    var diff = this.maxSize - this.minSize;
    return this.minSize + (diff * pressure);
}

                    
        

Sketcher.prototype.erase = function () {

	this.context.clearRect( 0, 0, this.context.width, this.context.height );
}

