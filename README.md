# Sharing DApp

This repository holds the code for a distributed app meant to run on the ethereum blockchain.

https://github.com/UnSciPreneur/sharingDApp/ 

For further background see our publication "_A Decentralised Sharing App running a Smart Contract on the Ethereum Blockchain_" published in the *Proceedings of the 6th International Conference on the Internet of Things* (Pages 177-178): http://b0x.it/l/K8f42

You will find more documentation regarding the app in `truffle_dapp/README.md`.

This project has been implemented with the friendly support of the Bosch IoT Lab (www.iot-lab.ch).

## Getting started

Check out the app from git using above URL. Then run (in `sharingDApp/`)
```
sudo npm install -g testrpc
npm install
./rpcnetwork.sh
```
and in a separate shell
```
cd truffle_dapp
truffle deploy
truffle serve
```
This will start up a `testrpc` client with the required accounts, deploy the smart contract into this test environment, and start the app. The app is then available at `http://localhost:8080`. 
 
Of course you can use a full ethereum client instead of `testrpc`. Simply adjust the port settings in `truffle_dapp/truffle.js` and make sure that the accounts you want to use are unlocked.

## Using the camera to detect QR Codes

**Warning:** Modern browsers (e.g. Chrome 57.0) do not grant access to the camera to scripts that have not been loaded over HTTPS. The only exception being scripts loaded from `localhost`. So please wrap the communication with the app in HTTPS if you serve the app from a remote location. We have tested this with Apache 2.4 and `mod_proxy`. 

If you only want to test the smart contracts and other app features you can circumvent the camera issue by entering the QR encoded urls manually. For a locally hosted app this would mean going to `http://localhost:8080/?objId=1234567` in your browser.

## Generating QR Codes

The app comes with a QR code reader. The QR codes are expected to encode a link of the form `https://your-domain.tld/?objId=1234567` where the GET parameter `objId` (mind the capital "I") contains the **numerical** id of a (to be) registered object.   

In order to generate QR codes you can go here: http://www.qrstuff.com/