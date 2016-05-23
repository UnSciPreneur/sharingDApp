module.exports = {
  build: {
    "index.html": "index.html",
    "objectIndex.html": "objectIndex.html",
    "scanObject.html": "scanObject.html",
    "qrcode-reader.js": [
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
    "qrcode-init.js": [
      "javascripts/qrcode/qr.js",
      "javascripts/qrcode/camera.js",
      "javascripts/qrcode/init.js"
    ],
    "jquery.min.js": "../node_modules/jquery/dist/jquery.min.js",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  deploy: [
    "RentableObjects"
  ],
  rpc: {
    host: "localhost",
    port: 8545
  }
};
