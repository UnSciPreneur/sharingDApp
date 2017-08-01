"use strict";

var accounts;
var account;
var objectId;
var contractOwner;
var balance;
var finney = 1 / 1000;
var wei = 1 / 1000000000000000000;

var contract = require('truffle-contract');
var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:28545");
var web3 = new Web3(provider);

var json = require('../../build/contracts/RentableObjects.json');
var RentableObjects = contract(json);
RentableObjects.setProvider(provider);

// blockCreator is a function for testRPC to mine an on-demand block every 30 seconds
var blockCreator = setInterval(function () {
  console.log("Creating Block.");
  web3.eth.sendTransaction({from: accounts[2], to: accounts[2], value: 5});

  if (objectId !== undefined) {
    getObjectClientTime(objectId, function (clientTime) {
      var clientTimeElement = document.getElementById("clientTime");
      clientTimeElement.innerHTML = parseInt(clientTime);
    });
  }

}, 30000);

var initWindow = function () {
  web3.eth.getAccounts(function (err, accs) {
    if (err !== null) {
      alert("There was an error fetching your accounts.");
      console.log(err, accs);
      return;
    }

    if (accs.length === 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    initState();

    accounts = accs;

    // if there is a GET parameter 'accNum' we use this
    var accNum = parseInt(get('accNum'));
    console.log(accNum);
    if ((accNum === 0) || (accNum === 1) || (accNum === 2)) {
      console.log("Switching to Account: ", accNum);
      account = accounts[accNum];
    }
    else {
      account = accounts[0];
      var remoteUrl = "192.168";
      if (window.location.href.indexOf(remoteUrl) >= 0) {
        // we are on the remote host
        account = accounts[1];
      }
    }

    refreshBalance();

    var objIdElement = document.getElementById("_objId");
    var _objId = get('objId');
    // the GET parameter 'objId' overrides a value set by the camera / qr code recognition
    if (_objId !== undefined) {
      objectId = _objId;
      objIdElement.value = _objId;
      switchPageView();
    }
  });
};


function initState() {
  var rentable = RentableObjects.deployed();

  rentable.then(function (instance) {
    return instance.getContractOwnerAddress.call({from: account});
  }).then(function (value) {
    contractOwner = value;
    if (!contractOwner) {
      // A likely cause for this is that you did not deploy the smart contract to the blockchain.
      throw "Expected contractOwner to be defined!";
    }

    console.log("Setting contractOwner=" + value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getContractOwnerAddress()");
  });
}

// this should only (!!) be called if an objectId has been set
var switchPageView = function() {
  refreshStatus();
  refreshDetails();
  refreshBalance();

  objectIsRegistered(objectId, function (registered) {
    if (registered) {
      // object is registered
      objectIsRented(objectId, function (rented) {
        if (rented) {
          // object is rented
          getObjectClientAddress(objectId, function (clientAddress) {
            if (clientAddress === account) {
              // account is client -> show rentOverview
              document.getElementById("ownersPage").style.display = "none";
              document.getElementById("reclaimPage").style.display = "none";
              document.getElementById("rentOverview").style.display = "block";
              document.getElementById("rentingPage").style.display = "none";
              document.getElementById("objectInformation").style.display = "block";
              document.getElementById("registerPage").style.display = "none";
              document.getElementById("notFoundPage").style.display = "none";
            }
            else if (account === contractOwner) {
              // account is owner -> show reclaimPage
              console.log("Account owns this (rented) object.");
              document.getElementById("ownersPage").style.display = "none";
              document.getElementById("reclaimPage").style.display = "block";
              document.getElementById("rentOverview").style.display = "none";
              document.getElementById("rentingPage").style.display = "none";
              document.getElementById("objectInformation").style.display = "block";
              document.getElementById("registerPage").style.display = "none";
              document.getElementById("notFoundPage").style.display = "none";
            }
            else {
              // account is third party -> show object information
              document.getElementById("ownersPage").style.display = "none";
              document.getElementById("reclaimPage").style.display = "none";
              document.getElementById("rentOverview").style.display = "none";
              document.getElementById("rentingPage").style.display = "none";
              document.getElementById("objectInformation").style.display = "block";
              document.getElementById("registerPage").style.display = "none";
              document.getElementById("notFoundPage").style.display = "none";
            }
          });
        }
        else {
          // object is unrented
          if (account === contractOwner) {
            // object is unrented -> show stats for owner
            document.getElementById("ownersPage").style.display = "block";
            document.getElementById("reclaimPage").style.display = "none";
            document.getElementById("rentOverview").style.display = "none";
            document.getElementById("rentingPage").style.display = "none";
            document.getElementById("objectInformation").style.display = "block";
            document.getElementById("registerPage").style.display = "none";
            document.getElementById("notFoundPage").style.display = "none";
          }
          else {
            // account is not owner -> show rentingPage
            document.getElementById("ownersPage").style.display = "none";
            document.getElementById("reclaimPage").style.display = "none";
            document.getElementById("rentOverview").style.display = "none";
            document.getElementById("rentingPage").style.display = "block";
            document.getElementById("objectInformation").style.display = "block";
            document.getElementById("registerPage").style.display = "none";
            document.getElementById("notFoundPage").style.display = "none";
          }
        }
      });
    }
    else {
      // object is unregistered
      if (account === contractOwner) {
        // account is contract owner -> show register screen
        document.getElementById("ownersPage").style.display = "none";
        document.getElementById("reclaimPage").style.display = "none";
        document.getElementById("rentOverview").style.display = "none";
        document.getElementById("rentingPage").style.display = "none";
        document.getElementById("objectInformation").style.display = "none";
        document.getElementById("registerPage").style.display = "block";
        document.getElementById("notFoundPage").style.display = "none";
      }
      else {
        // -> show not found screen
        document.getElementById("ownersPage").style.display = "none";
        document.getElementById("rentOverview").style.display = "none";
        document.getElementById("reclaimPage").style.display = "none";
        document.getElementById("rentingPage").style.display = "none";
        document.getElementById("objectInformation").style.display = "none";
        document.getElementById("registerPage").style.display = "none";
        document.getElementById("notFoundPage").style.display = "block";
      }
    }
  });
};

/*
 UTILITY FUNCTIONS
 */

// Return GET parameter value
function get(name) {
  if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
}

var toggleAccounts = function () {
  if (account === accounts[0]) {
    account = accounts[1];
  }
  else {
    account = accounts[0];
  }
  var addressElement = document.getElementById("address");
  addressElement.innerHTML = formatAccountAddress(account);

  // emptying potential status messages
  setStatus("");

  // only call switchPageView if we already have selected an object
  if (objectId !== undefined) {
    switchPageView();
    console.log("Switching page view");
  } else {
    // switchPageView executes refreshBalance internally
    refreshBalance();
  }
};

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function setLoading(show) {
  if (show) {
    document.getElementById("loadingDiv").style.display = "inline";
  }
  else {
    document.getElementById("loadingDiv").style.display = "none";
  }
}

function refreshBalance() {
  var addressElement = document.getElementById("address");
  addressElement.innerHTML = formatAccountAddress(account);

  var balance = web3.eth.getBalance(account) * wei;
  var balanceElement = document.getElementById("balance");
  balanceElement.innerHTML = balance.toFixed(3);
}

function viewRegisterPage(state) {
  var registerPage = document.getElementById("registerPage");
  var unregisterPage = document.getElementById("unregisterPage");
  if ((registerPage !== null) && (unregisterPage !== null)) {
    if (state) {
      registerPage.style.display = "none";
      unregisterPage.style.display = "block";
    }
    else {
      registerPage.style.display = "block";
      unregisterPage.style.display = "none";
    }
  }
}

/*
 RENTAL OBJECT UTILITY FUNCTIONS
 */

function objectIsRegistered(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.then(function (instance) {
    return instance.objectIsRegistered.call(objId, {from: account});
  }).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error getting objectIsRegistered()");
  });
}

function objectIsRented(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.then(function (instance) {
    return instance.objectIsRented.call(objId, {from: account})
  }).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error getting objectIsRented()");
  });
}

function getObjectDeposit(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.then(function (instance) {
    return instance.getObjectDeposit.call(objId, {from: account})
  }).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectDeposit()");
  });
}

function getObjectPricePerDay(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.then(function (instance) {
    return instance.getObjectPricePerDay.call(objId, {from: account})
  }).then(function (value) {
    callBack(parseInt(value));
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectPricePerDay()");
  });
}

function getObjectDescription(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.then(function (instance) {
    return instance.getObjectDescription.call(objId, {from: account})
  }).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectDescription()");
  });
}

function getObjectClientAddress(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.then(function (instance) {
    return instance.getObjectClientAddress.call(objId, {from: account})
  }).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectClientAddress()");
  });
}

function getObjectClientTime(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.then(function (instance) {
    return instance.getObjectClientTime.call(objId, {from: account})
  }).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectClientTime()");
  });
}

/*
 DISPLAY LOGIC
 */

function refreshStatus() {

  var addressElement = document.getElementById("address");
  addressElement.innerHTML = formatAccountAddress(account);

  var objIdElement = document.getElementById("objId");
  objIdElement.innerHTML = objectId;

  objectIsRegistered(objectId, function (value) {
    var registeredElement = document.getElementById("registered");
    if (value) {
      registeredElement.innerHTML = "";
    }
    else {
      registeredElement.innerHTML = "not ";
    }
    viewRegisterPage(value);
  });

  objectIsRented(objectId, function (value) {
    var rentedElement = document.getElementById("rented");
    if (value) {
      rentedElement.innerHTML = "";
    }
    else {
      rentedElement.innerHTML = "not ";
    }
  });

}

function refreshDetails() {
  // Contract abstraction layer for net-deployed contract:
  // var rentable = RentableObject.at(0x....);

  getObjectDeposit(objectId, function (value) {
    var depositElement = document.getElementById("deposit");
    var deposit = parseInt(value) * wei;
    depositElement.innerHTML = deposit.toFixed(4);
  });

  getObjectPricePerDay(objectId, function (value) {
    var pricePerDayElement = document.getElementById("pricePerDay");
    var pricePerDay = parseInt(value) * wei;
    pricePerDayElement.innerHTML = pricePerDay.toFixed(4);
  });

  getObjectDescription(objectId, function (value) {
    var descriptionElement = document.getElementById("description");
    descriptionElement.innerHTML = value;
  });

  getObjectClientTime(objectId, function (value) {
    var clientTimeElement = document.getElementById("clientTime");
    clientTimeElement.innerHTML = parseInt(value);
  });

  var clientObjectElement = document.getElementById("clientObject");
  if (clientObjectElement !== null) {
    clientObjectElement.innerHTML = parseInt(objectId);
  }
}

/*
 BUSINESS LOGIC
 */

function registerObject() {
  var rentable = RentableObjects.deployed();
  var deposit = parseInt(document.getElementById("_deposit").value) / wei;
  var pricePerDay = parseInt(document.getElementById("_pricePerDay").value) / wei;
  var description = document.getElementById("_description").value;

  console.log(rentable);
  console.log(pricePerDay);
  console.log(deposit);
  console.log(description);
  console.log(objectId);

  setStatus("Registering object... (please wait)");
  setLoading(true);
  setTimeout(function () {
    setLoading(false);
  }, 3000);
  // we store all value in wei

  rentable.then(function (instance) {
    return instance.registerObject(objectId, deposit, pricePerDay, description, {
      from: account,
      gas: 1000000
    })
  }).then(function (regSuccess) {
    if (regSuccess) {
      setStatus("New object registered successfully.");
    }
    else {
      setStatus("Object registering not possible. Please try again.");
    }
    switchPageView();
  }).catch(function (e) {
    console.log(e);
    setStatus("Error registering object; see log.");
  });
}

function unregisterObject() {
  var rentable = RentableObjects.deployed();

  setStatus("Unregistering object... (please wait)");

  rentable.then(function (instance) {
    return instance.unregisterObject(objectId, {from: account, gas: 1000000}).then(function (success) {
      if (success) {
        setStatus("Object removed successfully.");
      }
      else {
        setStatus("Unregistering object not possible. Please try again.");
      }
      refreshStatus();
    })
  }).catch(function (e) {
    console.log(e);
    setStatus("Error unregistering object; see log.");
  });
}

function rentObject() {
  setStatus("Renting object... (please wait)");
  getObjectDeposit(objectId, function (deposit) {
    var rentable = RentableObjects.deployed();
    console.log("Renting object with objId=%s", objectId);

    rentable.then(function (instance) {
      var objId = Number(objectId);
      return instance.rentObject(objId, {from: account, value: deposit, gas: 1000000}).then(function (success) {
        if (success) {
          setStatus("Object successfully rented.");
        }
        else {
          setStatus("Renting object not possible. Please try again.");
        }
        switchPageView();
      })
    }).catch(function (e) {
      console.log(e);
      setStatus("Error renting object; see log.");
    });
  });
}

function reclaimObject() {
  console.log("Reclaiming object with objectId=" + objectId);
  setStatus("Returning object... (please wait)");

  var rentable = RentableObjects.deployed();
  rentable.then(function (instance) {
    return instance.reclaimObject(objectId, {from: account, gas: 1000000}).then(function (success) {
    if (success) {
      console.log("Object with objectId=" + objectId + " successfully reclaimed.");
      setStatus("Object successfully reclaimed.");
    }
    else {
      console.log("Reclaiming object objectId=" + objectId + " not possible. Please try again.");
      setStatus("Reclaiming object not possible. Please try again.");
    }

    switchPageView();
  })}).catch(function (e) {
    console.log(e);
    setStatus("Error returning object; see log.");
  });
}

function formatAccountAddress(account) {
  return account.substr(0, 32) + '...';
}


module.exports = {
  initWindow: initWindow,
  toggleAccounts: toggleAccounts,
  switchPageView: switchPageView,
  registerObject: registerObject,
  rentObject: rentObject,
  unregisterObject: unregisterObject,
  reclaimObject: reclaimObject
};

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask");
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
});