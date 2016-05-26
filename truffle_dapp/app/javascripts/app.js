var accounts;
var account;
var balance;
var finney = 1/1000;
var wei = 1/1000000000000000000;

// blockCreator is a function for testRPC to mine an on demand block every 30 seconds
var blockCreator = setInterval(function(){
  console.log("Creating Block.");
  web3.eth.sendTransaction({from:accounts[2], to:accounts[2], value: 5});
}, 30000);

function switchPageView(objId) {
  refreshStatus(objId);
  refreshDetails(objId);

  objectIsRegistered(objId, function(registered) {
    if (registered) {
      // object is registered
      objectIsRented(objId, function(rented) {
        if (rented) {
          // object is rented
          getObjectClientAddress(objId, function(clientAddress) {
            if (clientAddress == account) {
              // account is client -> show rentOverview
              document.getElementById("objectInformation").style.display = "inline";
              document.getElementById("rentOverview").style.display = "inline";
              document.getElementById("rentingPage").style.display = "none";
              document.getElementById("registerPage").style.display = "none";
              document.getElementById("notFoundPage").style.display = "none";
            }
            else {
              // -> show objectInformation
              document.getElementById("objectInformation").style.display = "inline";
              document.getElementById("rentOverview").style.display = "none";
              document.getElementById("rentingPage").style.display = "none";
              document.getElementById("registerPage").style.display = "none";
              document.getElementById("notFoundPage").style.display = "none";
            }
          });
        }
        else {
          // object is unrented -> show rentingPage
          document.getElementById("objectInformation").style.display = "inline";
          document.getElementById("rentOverview").style.display = "none";
          document.getElementById("rentingPage").style.display = "inline";
          document.getElementById("registerPage").style.display = "none";
          document.getElementById("notFoundPage").style.display = "none";
        }
      });
    }
    else {
      // object is unregistered
      var rentable = RentableObjects.deployed();
      //if (account == rentable.creator) {
      if (true) {
        // account is contract owner -> show register screen
        document.getElementById("objectInformation").style.display = "none";
        document.getElementById("rentOverview").style.display = "none";
        document.getElementById("rentingPage").style.display = "none";
        document.getElementById("registerPage").style.display = "inline";
        document.getElementById("notFoundPage").style.display = "none";
      }
      else {
        // -> show not found screen
        document.getElementById("rentOverview").style.display = "none";
        document.getElementById("objectInformation").style.display = "none";
        document.getElementById("rentingPage").style.display = "none";
        document.getElementById("registerPage").style.display = "none";
        document.getElementById("notFoundPage").style.display = "inline";
      }
    }
  });
}

// Return GET parameter value
function get(name){
     if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

function toggleAccounts() {
  if (account == accounts[0]) {
    account = accounts[1];
  }
  else {
    account = accounts[0];
  }
  var addressElement = document.getElementById("address");
  addressElement.innerHTML = account;
  refreshBalance(account);
}

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function setLoading(show) {
  if (show) {
    document.getElementById("loadingDiv").style.display="inline";
  }
  else {
    document.getElementById("loadingDiv").style.display="none";
  }
}

function refreshBalance() {
  var rentable = RentableObjects.deployed();

  var addressElement = document.getElementById("address");
  addressElement.innerHTML = account;

  var balance = web3.eth.getBalance(account) * wei;
  var balanceElement = document.getElementById("balance");
  balanceElement.innerHTML = balance.toFixed(3);
}

function viewRegisterPage(state) {
  var registerPage = document.getElementById("registerPage");
  var unregisterPage = document.getElementById("unregisterPage");
  if ((registerPage != null) && (unregisterPage != null)) {
    if (state) {
      registerPage.style.display = "none";
      unregisterPage.style.display = "inline";
    }
    else {
      registerPage.style.display = "inline";
      unregisterPage.style.display = "none";
    }
  }
}

function objectIsRegistered(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.objectIsRegistered.call(objId, {from: account}).then(function(value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error getting objectIsRegistered()");
  });
}

function objectIsRented(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.objectIsRented.call(objId, {from: account}).then(function(value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error getting objectIsRented()");
  });
}

function getObjectDeposit(objId, callBack) {
  var rentable = RentableObjects.deployed();
  rentable.getObjectDeposit.call(objId, {from: account}).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectDeposit()");
  });
}

function getObjectPricePerDay(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.getObjectPricePerDay.call(objId, {from: account}).then(function (value) {
    callBack(parseInt(value));
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectPricePerDay()");
  });
}

function getObjectDescription(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.getObjectDescription.call(objId, {from: account}).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectDescription()");
  });
}

function getObjectClientContactInfo(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.getObjectClientContactInfo.call(objId, {from: account}).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectClientContactInfo()");
  });
}

function getObjectClientAddress(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.getObjectClientAddress.call(objId, {from: account}).then(function (value) {
    callBack(value);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectClientAddress()");
  });
}

  function getObjectClientTime(objId, callBack) {
    var rentable = RentableObjects.deployed();

    rentable.getObjectClientTime.call(objId, {from: account}).then(function (value) {
      callBack(value);
    }).catch(function (e) {
      console.log(e);
      setStatus("Error executing getObjectClientTime()");
    });
  }

function refreshStatus(objId) {

  var addressElement = document.getElementById("address");
  addressElement.innerHTML = account;

  var objIdElement = document.getElementById("objId");
  objIdElement.innerHTML = objId;

  objectIsRegistered(objId, function (value) {
    var registeredElement = document.getElementById("registered");
    if (value) {
      registeredElement.innerHTML = "";
    }
    else {
      registeredElement.innerHTML = "not ";
    }
    viewRegisterPage(value);
  });

  objectIsRented(objId, function(value) {
    var rentedElement = document.getElementById("rented");
    if(value) {
      rentedElement.innerHTML = "";
    }
    else {
        rentedElement.innerHTML = "not ";
    }
  });

}

function refreshDetails(objId) {
  // Contract abstraction layer for net-deployed contract:
  // var rentable = RentableObject.at(0x....);

  getObjectDeposit(objId, function (value) {
    var depositElement = document.getElementById("deposit");
    var deposit = parseInt(value) * wei;
    depositElement.innerHTML = deposit.toFixed(4);
  });

  getObjectPricePerDay(objId, function (value) {
    var pricePerDayElement = document.getElementById("pricePerDay");
    var pricePerDay = parseInt(value) * wei;
    pricePerDayElement.innerHTML = pricePerDay.toFixed(4);
  });

  getObjectDescription(objId, function (value) {
    var descriptionElement = document.getElementById("description");
    descriptionElement.innerHTML = value;
  });

  getObjectClientTime(objId, function (value) {
    var clientTimeElement = document.getElementById("clientTime");
    clientTimeElement.innerHTML = parseInt(value);
  })
}

function registerObject(objId) {
  var rentable = RentableObjects.deployed();
  var deposit = parseInt(document.getElementById("_deposit").value) / wei;
  var pricePerDay = parseInt(document.getElementById("_pricePerDay").value) / wei;
  var description = document.getElementById("_description").value;

  console.log(rentable);
  console.log(pricePerDay);
  console.log(deposit);
  console.log(description);
  console.log(objId);

  setStatus("Registering object... (please wait)");
  setLoading(true);
  setTimeout(function(){ setLoading(false); }, 3000);
  // we store all value in wei

  // ToDo: we should store the value for deposit here, shouldn't we?
  rentable.registerObject(objId, deposit, pricePerDay, description, {from: account, gas: 1000000}).then(function(regSuccess) {
    if (regSuccess) {
      setStatus("New object registered successfully.");
    }
    else {
      setStatus("Object registering not possible. Please try again.");
    }
    refreshStatus(objId);
    refreshDetails(objId);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error registering object; see log.");
  });
}



function unregisterObject(objId) {
  var rentable = RentableObjects.deployed();

  setStatus("Unregistering object... (please wait)");

  rentable.unregisterObject(objId, {from: account, gas: 1000000}).then(function (success) {
    if (success) {
      setStatus("Object removed successfully.");
      refreshStatus(account);
    }
    else {
      setStatus("Unregistering object not possible. Please try again.");
      refreshStatus(account);
    }
  }).catch(function (e) {
    console.log(e);
    setStatus("Error unregistering object; see log.");
  });
}

function rentObject(objId) {
  setStatus("Renting object... (please wait)");
  getObjectDeposit(objId, function (deposit) {
    var rentable = RentableObjects.deployed();
    console.log("Renting objId:", objId);

    rentable.rentObject(objId, {from: account, value: deposit, gas: 1000000}).then(function(success) {
      if (success) {
        setStatus("Object successfully rented.");
      }
      else {
        setStatus("Renting object not possible. Please try again.");
      }
      switchPageView(objId);
    }).catch(function (e) {
      console.log(e);
      setStatus("Error renting object; see log.");
    });
  });
}

function returnObject(objId) {
  setStatus("Returning object... (please wait)");

  var rentable = RentableObjects.deployed();

  rentable.returnObject(objId, {from: account, gas: 1000000}).then(function(success) {
    if (success) {
      console.log("Object successfully returned.");
      setStatus("Object successfully returned.");
    }
    else {
      console.log("Returning object not possible. Please try again.");
      setStatus("Returning object not possible. Please try again.");
    }
  }).catch(function (e) {
    console.log(e);
    setStatus("Error returning object; see log.");
  });
}
