'use strict';

(function () {
    /*global angular*/
    /*global io*/
    angular.module('chat',['ui.router', 'angular-p5']).factory('socket', socket).factory('exampleSketch', exampleSketch);
    socket.$inject = ['$rootScope']


    exampleSketch.$inject =['p5', 'socket'];


    function socket($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }


    function exampleSketch(p5, socket) {

        return function(p) {
            var r = p.random(0, 255);
            var g = p.random(0, 255);
            var b = p.random(0,255);
            var input;
            var inputNombre;
            var button;
            var messages = [
                {
                    quien:"bot",
                    text: "Hola",
                    x:100,
                    y:100,
                    textSize: 20,
                    r:200,
                    g:100,
                    b:0,
                    t:255
                },
                {
                    quien:"bot",
                    text:"test",
                    x:200,
                    y:200,
                    textSize: 35,
                    r:100,
                    g:0,
                    b:100,
                    t:255
                }
            ];
            var height = 320, width = 640;
            p.setup = function() {
                p.createCanvas(width, height);
                p.background(51);
                p.createP("");
                inputNombre = p.createInput("@anonimo");
                input = p.createInput("Ingresa tu mensaje");
                button = p.createButton('Enviar');
                
                button.mousePressed(p.insertarMensaje);
                input.changed(p.insertarMensaje);
                //socket.on('mouse', p.newDrawing);
                socket.on('newMsg', p.nuevoMensaje);
            };

            p.nuevoMensaje = function (message) {
                console.log("Hola nuevo mensaje" + JSON.stringify(message));
                messages.push(message);
                console.log("length en nuevo msg " + messages.length);
            };

            p.insertarMensaje = function () {
                var message = {
                    quien:"Yo-->"+ inputNombre.value(),
                    text : input.value(),
                    x:p.random(width/3),
                    y:p.random(height/3),
                    textSize:p.random(10,25),
                    r:r,
                    g:g,
                    b:b,
                    t: 255
                };
                messages.push(message);
                
                input.value("");
                socket.emit('msg',{message:message, quien:inputNombre.value()});
                console.log("length" + messages.length);
            };

            /*p.newDrawing = function (data) {

                p.noStroke();
                p.fill(data.r, data.g ,data.b);
                p.ellipse(data.x, data.y, 20, 20);
                console.log("Hola");
            };*/

            /*p.mouseDragged = function () {

                var data = {
                    x:p.mouseX,
                    y:p.mouseY,
                    r:r,
                    g:g,
                    b:b
                }
                socket.emit('mouse',data)
                p.noStroke();
                p.fill(r,g,b);
                p.ellipse(p.mouseX, p.mouseY, 20, 20);
                console.log(p.mouseX+','+ p.mouseY);
            }*/

            p.draw = function() {
                //input.changed(insertarMensaje);
                p.background(51);
                for (var i = messages.length-1; i >=0;i--){

                    p.fill(messages[i].r,messages[i].g,messages[i].b, messages[i].t);
                    p.textSize(messages[i].textSize);
                    p.text(messages[i].quien+': '+ messages[i].text, messages[i].x,messages[i].y);
                    messages[i].y +=1;
                    messages[i].t-=1;
                    if(messages[i].y >height-10){
                        messages.splice(i,1);
                    }
                    console.log("heig" + height);
                }
            };
        };

    }

}());