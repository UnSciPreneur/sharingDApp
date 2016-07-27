/*
 The files in this package are taken from
 https://github.com/asbjornenge/jsqrcode-scanner
 However, I have replaced the dependencies by more recent node packages.

 Also see https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
 */

var camera = (function (p_vid_id, p_inter, p_scale) {

  if (p_vid_id == undefined) {
    console.log("ERROR: You need to specify the id of the <video> element with the camera data stream.");
    return;
  }

  var vid_id = p_vid_id;
  var interval = p_inter != undefined ? p_inter : 1000;
  var scale = p_scale != undefined ? p_scale : 0.5;

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
        // we are assuming 5-digit all numeric ids for simplicity
        objectId = parseInt(result.substr(-5));
        _objId.value = objectId;
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