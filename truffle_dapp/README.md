#Truffle Webapp:


### Install

```
$ npm install
$ npm install -g truffle
$ npm install -g ethereumjs-testrpc
$ truffle [build|compile|serve]
```
You can also run truffle via npm:
```
$ npm serve
```

Note that you should have an ethereum client running. If you want to use the local testnetwork run
```
$ testrpc
```
You can also run geth with the rpc option as in
```
$ geth --rpc
```

Start geth with rpc and accept incoming requests from browserdomain at port 8080
```
$ geth --testnet --rpc --rpccorsdomain "http://localhost:8080"
```

Start testrpc with 3 testaccounts with 180, 90, 65 ether each
```
$ testrpc --account="0xd1071e040d9471d25644ec381ab616853eb68028588fe17b2e4398b6853fef63,180000000000000000000" --account="0xe3a3c5ba1c42089db864600986f9cb469433a519c36a423e49899e50bcd3296f,90000000000000000000" --account="0x45e22b6b2e3e060b8faf85d05fef075b36f0902bc4d2e5af66adac848d9ba92,65000000000000000000"
```

### Design

By http://html5up.net/overflow. This design is free under the Creative Commons License (http://creativecommons.org/licenses/by/3.0/).
