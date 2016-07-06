'use strict';

(function () {
    /*global angular*/
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
        
        var angle = 0;
        p.setup = function() {
          p.createCanvas(480, 270);
          p.background(51);
          socket.on('mouse', p.newDrawing);
        };
    
        p.newDrawing = function (data) {
            
    	  p.noStroke();
    	  p.fill(data.r, data.g ,data.b);
    	  p.ellipse(data.x, data.y, 36, 36);
    
    
        }
        
        p.mouseDragged = function () {
          
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
          p.ellipse(p.mouseX, p.mouseY, 36, 36);
          console.log(p.mouseX+','+ p.mouseY);
        }
    
        p.draw = function() {
    
          /*var colorAngle = p.radians(p.frameCount);
          var colorVector = p5.Vector.fromAngle(colorAngle).setMag(255);
          
          p.background(r, g, colorVector.x);
          p.fill(r, g, colorVector.y);
          p.rect(0, 0, p.width / 2, p.height);*/
        };
      };
    
        }
    
}());