navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var cam_video_id = "camsource";
var streaming = false;

window.addEventListener('DOMContentLoaded', function () {
  // Assign the <video> element to a variable
  var video = document.getElementById(cam_video_id);

  var options = {
    "audio": false,
    "video": {facingMode: {exact: 'environment'}}
  };
  // Replace the source of the video element with the stream from the camera
  if (navigator.getUserMedia) {
    navigator.getUserMedia(options, function (stream) {
      video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
    }, function (error) {
      console.log(error)
    });
    // Below is the latest syntax. Using the old syntax for the time being for backwards compatibility.
    // navigator.getUserMedia({video: true}, successCallback, errorCallback);
  } else {
    $("#qr-value").text('Sorry, native web camera streaming (getUserMedia) is not supported by this browser...');
  }

  video.addEventListener('canplay', function(ev){
    var canvas = document.getElementById("qr-canvas");
    var camcontainer = document.getElementById("camcontainer");

    var width = camcontainer.clientWidth;

    if (!streaming) {
      var height = video.videoHeight / (video.videoWidth/width);

      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.

      if (isNaN(height)) {
        height = width / (4/3);
      }

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

}, false);

$(document).ready(function () {
  if (!navigator.getUserMedia) return;
  cam = camera(cam_video_id);
  cam.start()
});