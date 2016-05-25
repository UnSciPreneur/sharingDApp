module.exports = {
  build: {
    "index.html": "index.html",
    "objectIndex.html": "objectIndex.html",
    "js/qrcode-reader.js": [
      "../node_modules/qrcode-reader/src/grid.js",
      "../node_modules/qrcode-reader/src/version.js",
      "../node_modules/qrcode-reader/src/detector.js",
      "../node_modules/qrcode-reader/src/formatinf.js",
      "../node_modules/qrcode-reader/src/errorlevel.js",
      "../node_modules/qrcode-reader/src/bitmat.js",
      "../node_modules/qrcode-reader/src/datablock.js",
      "../node_modules/qrcode-reader/src/bmparser.js",
      "../node_modules/qrcode-reader/src/datamask.js",
      "../node_modules/qrcode-reader/src/rsdecoder.js",
      "../node_modules/qrcode-reader/src/gf256poly.js",
      "../node_modules/qrcode-reader/src/gf256.js",
      "../node_modules/qrcode-reader/src/decoder.js",
      "../node_modules/qrcode-reader/src/qrcode.js",
      "../node_modules/qrcode-reader/src/findpat.js",
      "../node_modules/qrcode-reader/src/alignpat.js",
      "../node_modules/qrcode-reader/src/databr.js"
    ],
    "js/qrcode-init.js": [
      "javascripts/qrcode/camera.js",
      "javascripts/qrcode/init.js"
    ],
    "js/jquery.min.js": "../node_modules/jquery/dist/jquery.min.js",
    "js/util.js": "assets/js/util.js",
    "js/main.js": "assets/js/main.js",
    "js/skel.min.js": "assets/js/skel.min.js",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/",
    "assets/css/": "assets/css/",
    "assets/fonts/": "assets/fonts/",
    "assets/js/": "assets/js/"
  },
  deploy: [
    "RentableObjects"
  ],
  rpc: {
    host: "localhost",
    port: 8545
  }
};
