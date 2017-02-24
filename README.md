# Sharing DApp

This repository holds the code for a distributed app meant to run on the ethereum blockchain.

https://github.com/UnSciPreneur/sharingDApp/

You will find more documentation regarding the app in `truffle_dapp/README.md`.

This project has been implemented with the friendly support of the Bosch IoT Lab (www.iot-lab.ch).

## Generating QR Codes

The app comes with a QR code reader. The QR codes are expected to encode a link of the form `https://your-domain.tld/?objid=1234567` where the GET parameter `objid` contains the (not necessarily numerical) id of a (to be) registered object.   

In order to generate QR codes you can go here: http://www.qrstuff.com/