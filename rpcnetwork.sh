#!/bin/bash

NC='\033[0m' # No Color
RED='\033[0;31m'
printf "Starting up the ${RED}test network${NC}\n"

# filtering "eth_call" statements
# highlighting "eth_sendTransaction"
testrpc --port 18545 --account="0xd1071e040d9471d25644ec381ab616853eb68028588fe17b2e4398b6853fef63,200000000000000000000" --account="0xe3a3c5ba1c42089db864600986f9cb469433a519c36a423e49899e50bcd3296f,100000000000000000000" --account="0x45e22b6b2e3e060b8faf85d05fef075b36f0902bc4d2e5af66adac848d9ba92,100000000000000000000" -v | sed -r -e '/^eth_call$/d' -e $'s/^(eth_sendTransaction)$/\e[0;31m&\e[0m/'
