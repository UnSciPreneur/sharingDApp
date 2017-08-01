

/*
 The files in this package are taken from
 https://github.com/asbjornenge/jsqrcode-scanner
 However, I have replaced the dependencies by more recent node packages.

 Also see https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
 */

var camera = (function (p_vid_id, p_inter, p_scale) {

  if (p_vid_id === undefined) {
    console.log("ERROR: You need to specify the id of the <video> element with the camera data stream.");
    return;
  }

  var vid_id = p_vid_id;
  var interval = p_inter !== undefined ? p_inter : 1000;
  var scale = p_scale !== undefined ? p_scale : 0.5;

  var video = document.getElementById(vid_id);
  var int_id = null;

  function start() {
    int_id = setInterval(function (video, scale) {
      capture()
    }, interval);
    console.log("Setting interval with id " + int_id);
  }

  function stop() {
    console.log("Clearing interval with id " + int_id);
    clearInterval(int_id);
  }

  function capture() {
    // console.time('capture');
    var w = video.videoWidth * scale;
    var h = video.videoHeight * scale;
    var qr = new QrCode();
    qr.callback = function (result) {
      if (/http[s]*:/.test(result)) {
        console.log(Date.now() + ': ' + result);
        //$("#qr-value").text(result);

        deactivateCam();
        // select the object for registration/renting/return/...
        // the contract expects a numerical id!
        var cutIdx = result.indexOf('?objId=');
        if (cutIdx >= 0) {
          var objId = parseInt(result.substr(cutIdx + 7));
          _objId.value = objId;
          $("#qr-value").text(objId);
        } else {
          alert("Invalid URL in QR code!");
        }
        switchPageView();

        //ToDo: make this scroll smoothly
        location.hash = "#contextmenu";
      }
    };

    try {
      var qr_can = document.getElementById('qr-canvas').getContext('2d');
      qr_can.drawImage(video, 0, 0, w, h);
      var data = qr_can.getImageData(0, 0, w, h);

      qr.decode(data);
    }
    catch (err) {
      $("#qr-value").text(err);
    }
    // console.timeEnd('capture');
  }

  return {
    interval: interval,
    scale: scale,
    start: start,
    stop: stop,
    capture: capture
  }

});

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var cam_video_id = "camsource";
var streaming = false;
var track;

$("#cambutton").click(function () {
  activateCam()
});

function deactivateCam() {
  cam.stop();
  console.log("Camera deactivated");

  var video = document.getElementById(cam_video_id);
  video.removeEventListener("canplay", resizeCamCanvas);
  video.style.display = "none";

  if (track) {
    track.stop();
  }

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
    "video": {facingMode: {exact: "environment"}}
  };
  // Replace the source of the video element with the stream from the camera
  if (navigator.getUserMedia) {
    navigator.getUserMedia(options, function (stream) {
      video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      video.width = camcontainer.clientWidth;
      track = stream.getTracks()[0];
    }, function (error) {
      console.log(error);
      alert('No camera found!');
      deactivateCam();
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

  if (typeof cam === 'undefined') {
    cam = camera(cam_video_id);
  }
  cam.start();
}