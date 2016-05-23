module.exports = {
  build: {
    "index.html": "index.html",
    "objectIndex.html": "objectIndex.html",
    "rentIndex.html": "rentIndex.html",
    "scanObject.html": "scanObject.html",
    "qrscanner.js": [
        "../node_modules/zxing/lib/alignpat.js",
        "../node_modules/zxing/lib/grid.js"
    ],
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
