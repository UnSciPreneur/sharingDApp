navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var cam_video_id = "camsource";

window.addEventListener('DOMContentLoaded', function () {
  // Assign the <video> element to a variable
  var video = document.getElementById(cam_video_id);
  var canvas = document.getElementById("qr-canvas");
  var camcontainer = document.getElementById("camcontainer");

  video.setAttribute("width", camcontainer.clientWidth);
  video.setAttribute("height", camcontainer.clientWidth * 75 / 100);
  canvas.setAttribute("width", camcontainer.clientWidth);
  canvas.setAttribute("height", camcontainer.clientWidth * 75 / 100);
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
}, false);

$(document).ready(function () {
  if (!navigator.getUserMedia) return;
  cam = camera(cam_video_id);
  cam.start()
});