angular.module('LiveMotionCtrl', []).controller('LiveMotionController', function($scope) {

	var dataContainerMotion = document.getElementById('dataContainerMotion');

	if(window.DeviceMotionEvent) {
	  window.addEventListener('devicemotion', function(event) {
   
                var x,y,z,r;
                if(event.accelerationIncludingGravity) {
                  x = event.accelerationIncludingGravity.x;
                  y = event.accelerationIncludingGravity.y;
                  z = event.accelerationIncludingGravity.z;

                }
                else if(event.acceleration) {
                  x = event.acceleration.x;
                  y = event.acceleration.y;
                  z = event.acceleration.z;
                }
                r = event.rotationRate;
                var html = '<strong>Acceleration</strong><br />';
                html += 'x: ' + x +'<br />y: ' + y + '<br/>z: ' + z+ '<br />';
                html += '<strong>Rotation rate</strong><br />';
                if(r!=null) html += 'alpha: ' + r.alpha +'<br />beta: ' + r.beta + '<br/>gamma: ' + r.gamma + '<br />';
                dataContainerMotion.innerHTML = html;
                  
                });

  	}
})


	/*
  var accX,accY,accZ,accR;
  $scope.liveData = document.getElementById('motionContainer');*/
  /* Motion listener *//*
  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function(event) {
      if(event.accelerationIncludingGravity) {
        accX = event.accelerationIncludingGravity.x;
        accY = event.accelerationIncludingGravity.y;
        accZ = event.accelerationIncludingGravity.z;
      }else if(event.acceleration){
        accX = event.acceleration.x;
        accY = event.acceleration.y;
        accZ = event.acceleration.z; 
      }
      accR = event.rotationRate;
    });
  }

  $scope.live = function(){
    var liveData = '';
    $scope.live = document.getElementById('motionContainer');
    if($scope.accR != undefined){
      liveData = '<table class="table table-hover" ><thead><tr><th>Motion</th><th>Rotation</th></tr></thead><tbody>'+
          '<tr><td>X: '+accX+'</td><td>Alpha: '+accR.alpha+'</td></tr>'+
          '<tr><td>Y: '+accY+'</td><td>Beta: '+accR.beta+'</td></tr>'+
          '<tr><td>Z: '+accZ+'</td><td>Gamma: '+$ccR.gamma+'</td></tr>'+
          '</tbody></table>';
    }else{liveData = 'Device motion not accessible';}
    $scope.live.innerHTML = liveData;
  }*/