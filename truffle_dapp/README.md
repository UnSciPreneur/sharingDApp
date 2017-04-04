# Truffle Webapp

## Requirements

Run the following commands in the `truffle_dapp` directory to install required dependencies:
```
$ npm install
$ npm install -g ethereumjs-testrpc
```
**Attention:** It is important to install a version 1.* of truffle as our build scripts are not compatible with newer versions of truffle:
http://truffleframework.com/docs/getting_started/build

## Running RPC or geth client

Note that you should have an ethereum client running before you can start the app. If you want to use the local `testrpc` run
```
$ rpcnetwork.sh
```
This will open an rpc endpoint on port `28545` to avoid conflict with the standard geth rpc port. The testrpc is initialized with three accounts owning 200 or 100 ETH respectively.
 
Instead you can also run the standard geth client with the rpc option (port `8545`) as in
```
$ geth --rpc [--testnet] --rpccorsdomain "http://localhost:8080"
```
In this case you have to provide accounts and a sufficient balance manually.

Make sure that the settings in `truffle_dapp/truffle.js` match your choice. Both _host_ and _port_ must match your setup. 

## Deploying and running the smart contract / app

To deploy the smart contract into the ethereum network of your choice, i.e., _testrpc_ or _ropsten/mainnet_ = (global test network/main network) run the following in `truffle_dapp`:
```
$ truffle deploy
```
Then start the dapp with:
```
$ truffle serve
```

### Design

By http://html5up.net/overflow. This design is free under the Creative Commons License (http://creativecommons.org/licenses/by/3.0/).
