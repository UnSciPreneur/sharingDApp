# Sharing DApp

This repository holds the code for a distributed app meant to run on the ethereum blockchain.

https://github.com/UnSciPreneur/sharingDApp/ 

For further background see our publication "_A Decentralised Sharing App running a Smart Contract on the Ethereum Blockchain_" published in the *Proceedings of the 6th International Conference on the Internet of Things* (Pages 177-178): http://b0x.it/l/K8f42

You will find more documentation regarding the app in `truffle_dapp/README.md`.

This project has been implemented with the friendly support of the Bosch IoT Lab (www.iot-lab.ch).

## Generating QR Codes

The app comes with a QR code reader. The QR codes are expected to encode a link of the form `https://your-domain.tld/?objid=1234567` where the GET parameter `objid` contains the (not necessarily numerical) id of a (to be) registered object.   

In order to generate QR codes you can go here: http://www.qrstuff.com/