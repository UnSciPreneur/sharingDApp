module.exports = {
  build: {
    "index.html": "index.html",
    "objectIndex.html": "objectIndex.html",
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
