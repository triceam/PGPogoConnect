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
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
        document.addEventListener( 'touchstart', function onTouchStart( event ) {
                                  
            event.preventDefault();
            event.stopPropagation();
            return false;
        } );
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.log('PhoneGap DeviceReady');

        //turn this on to output verbose details about pogoconnect pen events
        window.pogoConnect.debug = true;

        document.addEventListener( pogoConnect.PEN_CONNECTING, function() {
            app.log("pen connecting");
        } )
        document.addEventListener( pogoConnect.PEN_CONNECT, function() {
            app.log("pen connected");
        } )
        document.addEventListener( pogoConnect.PEN_TIP_DOWN, function() {
            var touch = document.getElementById("touch");
            touch.style["display"] = "block";
        } )
        document.addEventListener( pogoConnect.PEN_TIP_UP, function() {
            var touch = document.getElementById("touch");
            touch.style["display"] = "none";
        } )
        document.addEventListener( pogoConnect.PEN_TOUCH_BEGIN, function(event) {
            app.update( event.detail );
        } )
        document.addEventListener( pogoConnect.PEN_TOUCH_MOVE, function(event) {
            app.update( event.detail );
        } )
        document.addEventListener( pogoConnect.PEN_TOUCH_END, function(event) {
            //nothing for now
        } )

    },
    log:function(message) {
        var output = document.getElementById("output");
        var innerHTML = message + "<br/>";// + output.innerHTML;
        output.innerHTML = innerHTML;
    },
    update:function(touchInfo) {
        var touch = document.getElementById("touch");
        touch.innerHTML = touchInfo.pressure;
        
        touch.style.left = touchInfo.x +"px";
        touch.style.top = touchInfo.y +"px";
    }
};
