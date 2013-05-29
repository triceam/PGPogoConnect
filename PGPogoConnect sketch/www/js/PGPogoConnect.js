window.pogoConnect = {
    PEN_CONNECT: "penConnect",
    PEN_CONNECTING: "penConnecting",
    PEN_DISCONNECT: "penDisconnect",
    PEN_TOUCH_BEGIN: "penBegin",
    PEN_TOUCH_MOVE: "penMove",
    PEN_TOUCH_END: "penEnd",
    PEN_PRESSURE_CHANGE: "penPressurechange",
    PEN_TIP_DOWN: "penTipDown",
    PEN_TIP_UP: "penTipUp",
    PEN_BUTTON_UP: "penButtonUp",
    PEN_BUTTON_DOWN: "penButtonDown",
    LOW_BATTERY: "lowBattery",

    debug:false,
    pen:{
        identifier: 0,
        connected:false,
        x:NaN,
        y:NaN,
        pressure:0,
        buttonDown:false,
        tipDown:false,
        lowBattery:false
    },

    penConnect: function() {
        this.pen.connected = true;
        this.dispatchEvent( this.PEN_CONNECT );
    },
    penConnecting: function() {
        this.pen.connected = false;
        this.dispatchEvent( this.PEN_CONNECTING );
    },
    penDisconnect: function() {
        this.pen.connected = true;
        this.dispatchEvent( this.PEN_DISCONNECT );
    },

    penTouchBegin: function(touchInfo) {
        this.setPenForTouch(touchInfo);
        this.dispatchEvent( this.PEN_TOUCH_BEGIN );
    },
    penTouchMove: function(touchInfo) {
        this.setPenForTouch(touchInfo);
        this.dispatchEvent( this.PEN_TOUCH_MOVE );
    },
    penTouchEnd: function(touchInfo) {
        this.setPenForTouch(touchInfo);
        this.dispatchEvent( this.PEN_TOUCH_END );
    },
    pressureChange: function(pressure) {
        this.pressure = pressure;
        this.dispatchEvent( this.PEN_PRESSURE_CHANGE );
    },
    buttonDown: function () {
        this.pen.buttonDown = true;
        this.dispatchEvent( this.PEN_BUTTON_DOWN );
    },
    buttonUp: function () {
        this.pen.buttonDown = false;
        this.dispatchEvent( this.PEN_BUTTON_UP );
    },
    tipDown: function (touchInfo) {
        this.pen.tipDown = true;
        this.setPenForTouch(touchInfo);
        this.dispatchEvent( this.PEN_TIP_DOWN );
    },
    tipUp: function (touchInfo) {
        this.pen.tipDown = true;
        this.setPenForTouch(touchInfo);
        this.dispatchEvent( this.PEN_TIP_UP );
    },

    lowBattery:function() {
        this.pen.lowBattery = true;
        this.dispatchEvent( this.LOW_BATTERY );
    },


    setPenForTouch:function(touchInfo) {
        this.pen.x = touchInfo.x;
        this.pen.y = touchInfo.y;
        this.pen.pressure = touchInfo.pressure;
    },
    log:function(type) {
        if (this.debug) {
            console.log("PGPogoConnect::" + type + " x:" + this.pen.x + " y:" + this.pen.y + ", pressure:" + this.pen.pressure + " buttonDown: " + this.pen.buttonDown + " tipDown:" + this.pen.tipDown + " connected: " + this.connected);
        }
    },
    dispatchEvent:function(type){
        this.log(type);
        var event = new CustomEvent(type, {"detail":this.pen});
        document.dispatchEvent(event);
    },
    
    setPenLEDColor: function(r, g, b){
        
        if ( this.pen.connected ) {
            cordova.exec(function(param) {}, function() {}, "PGPogoConnect", "setPenLEDColor", [r.toString(),g.toString(),b.toString()]);
        }
    },

    queryPen:function() {
        var self = this;
        //make a call to native, ignore callbacks b/c native will write back to js as an event
        cordova.exec(function(param) {

            try{
                console.log ("queryPen");
                console.log( param )
 
                var connected = self.pen.connected;
                console.log ("connected");
                     var obj = JSON.parse( param );
                     console.log (obj.connected);
                self.setPenForTouch( obj );
                console.log ("setPenForTouch");

                if ( !connected && obj.connected){
                    self.penConnect();
                    console.log ("penConnect");
                }
            }
                     catch(e){
                     console.log(e.message);
                     console.log(e);
            }


        }, function() {}, "PGPogoConnect", "queryPen", []);
    }
    
}

document.addEventListener('deviceready', function() {
                          setTimeout( function(){
                                     window.pogoConnect.queryPen();
                                     }, 500 );
}, false);
