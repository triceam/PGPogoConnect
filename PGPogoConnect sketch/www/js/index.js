/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {

        //alert();
        this.bindEvents();

        this.updateBrush( 0,0,0 );

        this.sketcher = new Sketcher("canvas", this.currentBrush);

        this.thicknessSlider = {
            track: document.getElementById("thickness"),
            minThumb: document.getElementById("minThickness"),
            maxThumb: document.getElementById("maxThickness"),
            minValue:0,
            maxValue:1,
            updateValues:function() {
                var width = (this.track.offsetWidth-this.minThumb.offsetWidth);
                this.minValue = this.minThumb.lastPosition/width;
                this.maxValue = this.maxThumb.lastPosition/width;

                app.sketcher.minSize = this.minValue;
                app.sketcher.maxSize = this.maxValue;
            },
            updateUI:function() {
                var width = (this.track.offsetWidth-this.minThumb.offsetWidth);
                if ( this.minThumb.lastPosition == undefined ) {

                    if ( this.minThumb.defaultValue != undefined ) {
                        this.minThumb.lastPosition = this.minThumb.defaultValue * width;
                    }
                    else {
                        this.minThumb.lastPosition = 0;
                    }
                }
                if ( this.maxThumb.lastPosition == undefined ) {

                    if ( this.maxThumb.defaultValue != undefined ) {
                        this.maxThumb.lastPosition = this.maxThumb.defaultValue * width;
                    }
                    else {
                        this.maxThumb.lastPosition = 0;
                    }
                }

                this.minThumb.style.webkitTransform = 'translate3d(' + this.minThumb.lastPosition + 'px, 0, 0)';
                this.maxThumb.style.webkitTransform = 'translate3d(' + this.maxThumb.lastPosition + 'px, 0, 0)';
            },
            setDefaults: function( min, max ) {
                this.minThumb.defaultValue = min;
                this.maxThumb.defaultValue = max;
                this.minValue = min;
                this.maxValue = max;
                app.sketcher.minSize = this.minValue;
                app.sketcher.maxSize = this.maxValue;
            }

        }

        this.opacitySlider = {
            track: document.getElementById("opacity"),
            minThumb: document.getElementById("minOpacity"),
            maxThumb: document.getElementById("maxOpacity"),
            minValue:0,
            maxValue:1,
            updateValues:function() {
                var width = (this.track.offsetWidth-this.minThumb.offsetWidth);
                this.minValue = this.minThumb.lastPosition/width;
                this.maxValue = this.maxThumb.lastPosition/width;

                app.sketcher.minOpacity = this.minValue;
                app.sketcher.maxOpacity = this.maxValue;
            },
            updateUI:function() {
                var width = (this.track.offsetWidth-this.minThumb.offsetWidth);
                if ( this.minThumb.lastPosition == undefined ) {

                    if ( this.minThumb.defaultValue != undefined ) {
                        this.minThumb.lastPosition = this.minThumb.defaultValue * width;
                    }
                    else {
                        this.minThumb.lastPosition = 0;
                    }
                }
                if ( this.maxThumb.lastPosition == undefined ) {

                    if ( this.maxThumb.defaultValue != undefined ) {
                        this.maxThumb.lastPosition = this.maxThumb.defaultValue * width;
                    }
                    else {
                        this.maxThumb.lastPosition = 0;
                    }
                }

                this.minThumb.style.webkitTransform = 'translate3d(' + this.minThumb.lastPosition + 'px, 0, 0)';
                this.maxThumb.style.webkitTransform = 'translate3d(' + this.maxThumb.lastPosition + 'px, 0, 0)';
            },
            setDefaults: function( min, max ) {
                this.minThumb.defaultValue = min;
                this.maxThumb.defaultValue = max;
                this.minValue = min;
                this.maxValue = max;
                app.sketcher.minOpacity = this.minValue;
                app.sketcher.maxOpacity = this.maxValue;
            }
        }

        this.rInput = document.getElementById("inputR");
        this.gInput = document.getElementById("inputG");
        this.bInput = document.getElementById("inputB");
        this.updateTimeout = -1;

        this.rInput.addEventListener( "change", function() {

            app.brushR = app.rInput.value;
            app.updateBrushValues();
        });

        this.gInput.addEventListener( "change", function() {

            app.brushG = app.gInput.value;
            app.updateBrushValues();
        });

        this.bInput.addEventListener( "change", function() {

            app.brushB = app.bInput.value;
            app.updateBrushValues();
        });

        this.thicknessSlider.setDefaults( 0.25, 0.5 );
        this.opacitySlider.setDefaults( 0.25, 0.75 );


        this.drawEnabled = true;
    },


    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
        document.addEventListener( 'touchstart', function onTouchStart( event ) {

            //console.log( "touchstart: " + event.target.nodeName )
            if ( event.target.nodeName != "INPUT") {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        } );

        //turn this on to output verbose details about pogoconnect pen events
        //window.pogoConnect.debug = true;
        var touchSupported = ('ontouchstart' in window);

        this.mouseDownEvent = touchSupported ? "touchstart" : "mousedown";
        this.mouseUpEvent = touchSupported ? "touchend" : "mouseup";
        var eraseButton = document.getElementById("erase");
        eraseButton.addEventListener( this.mouseDownEvent, function() {
            app.sketcher.erase();
            app.toggleOptionsDisplay();
            app.log("canvas erased")
        })

        var closeButton = document.getElementById("closeOptions");
        closeButton.addEventListener( this.mouseDownEvent, function() {
            app.hideOptions();
        })

        var saveButton = document.getElementById("save");
        saveButton.addEventListener( this.mouseDownEvent, function() {
            window.plugins.canvas2ImagePlugin.saveImageDataToLibrary(
                function(msg){
                    console.log(msg);
                    app.toggleOptionsDisplay();
                    app.log("saved image to photo library")
                },
                function(err){
                    console.log(err);
                },
                app.sketcher.toImageData()
            );
        })

        //color buttons


        document.getElementById("black").addEventListener( this.mouseDownEvent, function() {
            app.updateBrush(0,0,0);
        })

        document.getElementById("red").addEventListener( this.mouseDownEvent, function() {
            app.updateBrush(211,34,32);
        })

        document.getElementById("orange").addEventListener( this.mouseDownEvent, function() {
            app.updateBrush(252,175,59);
        })

        document.getElementById("yellow").addEventListener( this.mouseDownEvent, function() {
            app.updateBrush(254,241,2);
        })

        document.getElementById("green").addEventListener( this.mouseDownEvent, function() {
            app.updateBrush(64,175,73);
        })

        document.getElementById("blue").addEventListener( this.mouseDownEvent, function() {
            app.updateBrush(0,173,241);
        })

        document.getElementById("purple").addEventListener( this.mouseDownEvent, function() {
            app.updateBrush(143,78,242);
        })

        document.getElementById("white").addEventListener( this.mouseDownEvent, function() {
            app.updateBrush(255,255,255);
        })




        //pen style buttons
        document.getElementById("circle").addEventListener( this.mouseDownEvent, function() {
            app.brushType = "circle";
            app.updateBrushValues();
        })

        document.getElementById("triangle").addEventListener( this.mouseDownEvent, function() {
            app.brushType = "triangle";
            app.updateBrushValues();
        })

        document.getElementById("caligraphic").addEventListener( this.mouseDownEvent, function() {
            app.brushType = "caligraphic";
            app.updateBrushValues();
        })



        //pen SDK events
        document.addEventListener( pogoConnect.PEN_BUTTON_DOWN, function() {
            var dc = app.isDoublePenButtonDown();

            if (dc) {
                console.log( "DOUBLE PEN BUTTON!");
                app.toggleOptionsDisplay();
            }
            app.sketcher.toggleEraseMode();
        } )
        document.addEventListener( pogoConnect.PEN_BUTTON_UP, function() {
            app.sketcher.toggleEraseMode();
        } )

        document.addEventListener( pogoConnect.PEN_CONNECTING, function() {
            app.log("pen connecting");
        } )
        document.addEventListener( pogoConnect.PEN_CONNECT, function() {
            app.log("pen connected");
            app.initSketchEvents();
        } )
        document.addEventListener( pogoConnect.PEN_TIP_DOWN, function() {

            //app.sketcher.drawBegin( data );

            console.log(pogoConnect.PEN_TIP_DOWN);
            document.addEventListener(this.mouseDownEvent, app.onTouchStart);
            document.addEventListener(this.mouseMoveEvent, app.onTouchMove);

        } )
        document.addEventListener( pogoConnect.PEN_TIP_UP, function() {
            //nothing for now
        } )
        /*document.addEventListener( pogoConnect.PEN_TOUCH_BEGIN, function(event) {
         app.update( event.detail );
         } )
         document.addEventListener( pogoConnect.PEN_TOUCH_MOVE, function(event) {
         app.update( event.detail );
         } )
         document.addEventListener( pogoConnect.PEN_TOUCH_END, function(event) {
         //nothing for now
         } )    */
    },

    updateBrushValues: function() {

        clearTimeout( this.updateTimeout );
        this.updateTimeout = setTimeout( function() {
            app.updateBrush( app.brushR, app.brushG, app.brushB );
        }, 100 );
    },

    updateBrush: function( r, g, b ) {

        this.brushR = r;
        this.brushG = g;
        this.brushB = b;

        console.log("rgba("+r+","+g+","+b+",0.45)")
        var canvas = document.createElement('canvas');
        canvas.width  = 50;
        canvas.height  = 50;
        var ctx = canvas.getContext("2d");

        var previewCanvas = document.getElementById("preview");
        var previewCtx = previewCanvas.getContext("2d");

        app.renderBrush( ctx, 0.45, 1 );
        app.renderBrush( previewCtx, 1, 2 );

        var img = new Image();
        img.src = canvas.toDataURL();
        this.currentBrush = img;

        window.pogoConnect.setPenLEDColor( r,g,b );

        if( app.sketcher ) {
            console.log("setting brush")
            this.sketcher.brush = img;

            this.rInput.value = r;
            this.gInput.value = g;
            this.bInput.value = b;
            //app.rSlider.setValue(r);
            //app.gSlider.setValue(g);
            //app.bSlider.setValue(b);
        }
    },

    renderBrush: function ( context, alpha, scale ) {
        context.clearRect(0,0,50*scale,50*scale);
        context.beginPath();
        switch( this.brushType ) {
            case "square":
                context.fillRect( 5*scale,5*scale,40*scale,40*scale );
                break;
            case "triangle":
                context.moveTo( 25*scale,0 );
                context.lineTo( 50*scale,50*scale );
                context.lineTo( 0,50*scale );
                context.lineTo( 25*scale,0 );
                break;
            case "caligraphic":
                context.moveTo( 35*scale,0 );
                context.lineTo( 50*scale,5*scale );
                context.lineTo( 15*scale,50*scale );
                context.lineTo( 5*scale,50*scale );
                context.lineTo( 35*scale,0 );
                break;
            default:
                context.arc(25*scale, 25*scale, 24*scale, 0, 2 * Math.PI, false);
                break;
        }
        context.fillStyle = "rgba("+this.brushR+","+this.brushG+","+this.brushB+"," + alpha +")";
        context.fill();
    },

    initSketchEvents:function () {

        console.log("initSketchEvents");
        var touchSupported = ('ontouchstart' in window);

        this.mouseDownEvent = touchSupported ? "touchstart" : "mousedown";
        this.mouseMoveEvent = touchSupported ? "touchmove" : "mousemove";
        this.mouseUpEvent = touchSupported ? "touchend" : "mouseup";

        document.removeEventListener(this.mouseDownEvent, app.onTouchStart);
        document.removeEventListener(this.mouseMoveEvent, app.onTouchMove);

        document.removeEventListener( pogoConnect.PEN_TOUCH_BEGIN, app.penTouchBegin );
        document.removeEventListener( pogoConnect.PEN_TOUCH_MOVE, app.penTouchMove );
        document.removeEventListener( pogoConnect.PEN_TOUCH_END, app.penTouchEnd );
        document.removeEventListener( pogoConnect.PEN_TIP_UP, app.penTouchEnd );

        if ( window.pogoConnect.pen.connected ) {
            console.log("setup pen events")
            document.addEventListener( pogoConnect.PEN_TOUCH_BEGIN, app.penTouchBegin );
            document.addEventListener( pogoConnect.PEN_TOUCH_MOVE, app.penTouchMove );
            document.addEventListener( pogoConnect.PEN_TOUCH_END, app.penTouchEnd );
            document.addEventListener( pogoConnect.PEN_TIP_UP, app.penTouchEnd );
        }
        else {

            console.log("setup touch events")
            //document.addEventListener( this.mouseDownEvent, app.onTouchStart );
            //document.addEventListener( this.mouseMoveEvent, app.onTouchMove );
        }

        this.thicknessSlider.minThumb.removeEventListener(this.mouseDownEvent, app.sliderThumbTouchStart);
        this.thicknessSlider.maxThumb.removeEventListener(this.mouseDownEvent, app.sliderThumbTouchStart);
        this.thicknessSlider.minThumb.addEventListener(this.mouseDownEvent, app.sliderThumbTouchStart);
        this.thicknessSlider.maxThumb.addEventListener(this.mouseDownEvent, app.sliderThumbTouchStart);

        this.opacitySlider.minThumb.removeEventListener(this.mouseDownEvent, app.sliderThumbTouchStart);
        this.opacitySlider.maxThumb.removeEventListener(this.mouseDownEvent, app.sliderThumbTouchStart);
        this.opacitySlider.minThumb.addEventListener(this.mouseDownEvent, app.sliderThumbTouchStart);
        this.opacitySlider.maxThumb.addEventListener(this.mouseDownEvent, app.sliderThumbTouchStart);


    },

    penTouchBegin: function(event) {

        //console.log("penTouchBegin")
        if ( !app.drawEnabled ) {
            return false;
        }

        document.removeEventListener(this.mouseDownEvent, app.onTouchStart);
        document.removeEventListener(this.mouseMoveEvent, app.onTouchMove);
        var data = {
            x: event.detail.x,
            y: event.detail.y,
            pressure: event.detail.pressure,
            id: "pen"
        }
        app.sketcher.drawBegin( data );
    },

    penTouchMove: function(event) {

        //console.log("penTouchMove")
        if ( !app.drawEnabled ) {
            return false;
        }

        var data = {
            x: event.detail.x,
            y: event.detail.y,
            pressure: event.detail.pressure,
            id: "pen"
        }
        app.sketcher.drawMove( data );
    },

    penTouchEnd: function(event) {
        app.sketcher.clear( "pen" );
    },


    onTouchStart: function(event) {
        //console.log("onTouchStart")
        if ( !app.drawEnabled ) {
            return false;
        }

        var targetTouches = event.targetTouches || [event];

        for ( var x=0; x< targetTouches.length; x++ ) {
            var touch = targetTouches[x];
            var id = touch.identifier;
            if (id == undefined) {
                id = "input";
            }
            var data = {
                x: touch.pageX,
                y:touch.pageY,
                pressure: 0.5,
                id: id
            }

            app.sketcher.drawBegin( data );
        }

        event.preventDefault();
        return false;
    },

    onTouchMove: function(event) {
        //console.log("onTouchMove")
        if ( !app.drawEnabled ) {
            return false;
        }

        var changedTouches = event.changedTouches || [event];

        for ( var x=0; x< changedTouches.length; x++ ) {
            var touch = changedTouches[x];
            var id = touch.identifier;
            if (id == undefined) {
                id = "input";
            }
            var data = {
                x: touch.pageX,
                y:touch.pageY,
                pressure: 0.5,
                id: id
            }

            app.sketcher.drawMove( data );
        }

        event.preventDefault();
        return false;
    },

    isDoublePenButtonDown: function() {

        var MAX_DOUBLE_TAP_TIME = 700;
        var now = new Date().getTime();

        if (this.lastPenButtonDown == undefined) {
            this.lastPenButtonDown = now;
            return false;
        }
        else {
            var difference = now - this.lastPenButtonDown;
            this.lastPenButtonDown = now;
            if (difference < MAX_DOUBLE_TAP_TIME) {
                this.lastPenButtonDown = 0;
                return true;
            }
            return false;
        }

    },

    toggleOptionsDisplay: function() {

        if ( app.drawEnabled ) {
            app.showOptions();
        }
        else {
            app.hideOptions();
        }
    },

    showOptions: function() {
        app.drawEnabled = false;

        var options = document.getElementById("options");
        options.className = '';

        this.thicknessSlider.updateUI();
        this.opacitySlider.updateUI();
    },

    hideOptions: function() {
        app.drawEnabled = true;
        var options = document.getElementById("options");
        options.className = 'hidden';
    },

    sliderThumbTouchStart: function(event) {

        console.log(event)
        var thumb = event.target;
        var track = thumb.parentNode;
        var slider;
        var touch = event.targetTouches[0];
        var startPosition = {
            x:touch.pageX,
            y:touch.pageY
        }

        if( isNaN(thumb.lastPosition) ) {
            thumb.lastPosition = 0;
        }
        thumb.offset = startPosition.x - (track.offsetLeft+thumb.lastPosition);

        if ( track == app.thicknessSlider.track ) {
            slider = app.thicknessSlider;
        } else  {
            slider = app.opacitySlider;
        }

        var touchMove = function (e) {
            var touch = e.targetTouches[0];
            var difference = {
                x:startPosition.x - touch.pageX,
                y:startPosition.y - touch.pageY
            }

            var position = Math.max( 0, (startPosition.x - difference.x)-thumb.offset );
            position = Math.min( position, track.offsetWidth-thumb.offsetWidth );

            if (thumb == slider.minThumb) {
                position = Math.min( position, slider.maxThumb.lastPosition-thumb.offsetWidth );
            } else {
                position = Math.max( position, slider.minThumb.lastPosition+thumb.offsetWidth );
            }


            thumb.lastPosition = position;

            thumb.style.webkitTransform = 'translate3d(' + position + 'px, 0, 0)';

            startPosition.x = touch.pageX;
            startPosition.y = touch.pageY;
        };

        var touchEnd = function (e) {
            slider.updateValues();
            window.removeEventListener( app.mouseMoveEvent, touchMove );
            window.removeEventListener( app.mouseUpEvent, touchEnd );
        };

        window.addEventListener( app.mouseMoveEvent, touchMove );
        window.addEventListener( app.mouseUpEvent, touchEnd );

    },



    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.log('PhoneGap DeviceReady');
        app.sketcher.resizeContext();
        app.initSketchEvents();


        //app.showOptions();

    },
    log:function(message) {
        var output = document.getElementById("output");
        var innerHTML = message + "<br/>";// + output.innerHTML;
        output.innerHTML = innerHTML;
    }
};
