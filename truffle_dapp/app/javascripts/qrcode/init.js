navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var cam_video_id = "camsource";
var streaming = false;

$("#cambutton").click(function () {activateCam()});

function deactivateCam() {
  cam.stop();
  console.log("Camera deactivated");

  $("#camcontainer").html("<canvas id=\"qr-canvas\" style=\"display:none\"></canvas>");

  $("#cambutton").html("Activate camera");
  $("#cambutton").click(function () {activateCam()});

  streaming = false;
}

function activateCam() {
  console.log("Camera activated");

  $("#cambutton").html("Deactivate camera");
  $("#cambutton").click(function () {deactivateCam()});
  $("#camcontainer").html("<video id=\"camsource\" autoplay style=\"position: relative; display: inline-block\">We could not detect your camera. Sorry.</video><canvas id=\"qr-canvas\" style=\"display:none\"></canvas>");

  startRecoding();

  // Assign the <video> element to a variable
  var video = document.getElementById(cam_video_id);
  var camcontainer = document.getElementById("camcontainer");

  var options = {
    "audio": false,
    "video": {facingMode: {exact: 'environment'}}
  };
  // Replace the source of the video element with the stream from the camera
  if (navigator.getUserMedia) {
    navigator.getUserMedia(options, function (stream) {
      video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      video.width = camcontainer.clientWidth;
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

    var width = camcontainer.clientWidth;
    camcontainer.setAttribute('height', width);

    if (!streaming) {
      var height = video.videoHeight / (video.videoWidth/width);

      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.

      if (isNaN(height)) {
        height = width / (4/3);
      }

      video.setAttribute('width', width*width/height);
      video.setAttribute('height', width);
      // the following does not work reliably
      video.setAttribute('margin-left', - (width*width/height - width)/2 + "px");
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);

}

function startRecoding(){
  if (!navigator.getUserMedia) return;
  cam = camera(cam_video_id);
  cam.start()
}