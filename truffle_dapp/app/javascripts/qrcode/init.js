navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var cam_video_id = "camsource";
var streaming = false;

$("#cambutton").click(function () {
  activateCam()
});

function deactivateCam() {
  cam.stop();
  console.log("Camera deactivated");

  var video = document.getElementById(cam_video_id);
  video.removeEventListener("canplay",resizeCamCanvas);
  video.style.display = "none";

  $("#cambutton").html("Activate Camera");
  $("#cambutton").unbind();
  $("#cambutton").click(function () {
    activateCam()
  });

  streaming = false;
}

function resizeCamCanvas() {
  console.log("Resizing camera canvas");
  var video = document.getElementById(cam_video_id);
  var canvas = document.getElementById("qr-canvas");

  var width = camcontainer.clientWidth;
  camcontainer.setAttribute('height', width);

  if (!streaming) {
    var height = video.videoHeight / (video.videoWidth / width);

    // Firefox currently has a bug where the height can't be read from
    // the video, so we will make assumptions if this happens.

    if (isNaN(height)) {
      height = width / (4 / 3);
    }

    video.style.width = width * width / height;
    video.style.height = width;
    // the following does not work reliably
    //video.style.marginLeft = -(width * width / height - width) / 2 + "px";
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    streaming = true;
  }
}

function activateCam() {
  console.log("Camera activated");

  $("#cambutton").html("Deactivate Camera");
  $("#cambutton").unbind();
  $("#cambutton").click(function () {
    deactivateCam()
  });
  var camcontainer = document.getElementById("camcontainer");
  var video = document.getElementById(cam_video_id);
  video.style.display = "inline-block";

  startRecoding();

  // the following should be working according to
  // http://w3c.github.io/mediacapture-main/getusermedia.html#def-constraint-facingMode
  var options = {
    "audio": false,
    "video": { facingMode: {exact: "environment"} }
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

  video.addEventListener('canplay', resizeCamCanvas(), false);

}

function startRecoding() {
  if (!navigator.getUserMedia) return;

  if(typeof cam == 'undefined') {
    cam = camera(cam_video_id);
  }
  cam.start();
}