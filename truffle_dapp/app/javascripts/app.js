var accounts;
var account;
var balance;

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
}

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function refreshBalance() {
  var rentable = RentableObjects.deployed();

  var addressElement = document.getElementById("address");
  addressElement.innerHTML = account;

  rentable.getAccountBalance.call(account, {from: account}).then(function (value) {
    var balanceElement = document.getElementById("balance");
    if (balanceElement != null)
      balanceElement.innerHTML = value.valueOf();
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getAccountBalance(); see log.");
  });
}

// objectApp javascript code

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

function getObjectPrice(objId, callBack) {
  var rentable = RentableObjects.deployed();

  rentable.getObjectPrice.call(objId, {from: account}).then(function (value) {
    callBack(parseInt(value));
  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectPrice()");
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

function refreshStatus(objId) {
  //var rentable = RentableObjects.deployed();

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
  //var rentable = RentableObjects.deployed();
  // Contract abstraction layer for net-deployed contract:
  // var rentable = RentableObject.at(0x....);

  getObjectPrice(objId, function (value) {
    var priceElement = document.getElementById("price");
    priceElement.innerHTML = parseInt(value);
  });



  getObjectDescription(objId, function (value) {
    var descriptionElement = document.getElementById("description");
    descriptionElement.innerHTML = value;
  });

  getObjectClientContactInfo(objId, function (value) {
    var contactInfoElement = document.getElementById("contactInfo");
    contactInfoElement.innerHTML = value;
  });
}

function registerObject(objId) {
  var rentable = RentableObjects.deployed();

  var price = parseInt(document.getElementById("price").value);
  var amortizationPeriod = parseInt(document.getElementById("amortizationPeriod").value);
  var description = document.getElementById("description").value;

  setStatus("Registering object... (please wait)");

  rentable.addObject(objId, price, description, {from: account}).then(function(success) {
    console.log(success);
    if (success) {
      setStatus("New object registered successfully.");
    }
    else {
      setStatus("Object registering not possible. Please try again.");
    }
    refreshStatus(objId);
  }).catch(function (e) {
    console.log(e);
    setStatus("Error registering object; see log.");
  });
}

function unregisterObject(objId) {
  var rentable = RentableObjects.deployed();

  setStatus("Unregistering object... (please wait)");

  rentable.removeObject(objId, {from: account}).then(function (success) {
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
  var rentable = RentableObjects.deployed();

  setStatus("Renting object... (please wait)");
  var contactInfo = document.getElementById("_contactInfo").value;

  rentable.getObjectPrice.call(objId, {from: account}).then(function (value) {
    var objPrice = parseInt(value);

    rentable.rentObject(objId, contactInfo, {from: account, value: objPrice}).then(function (success) {
      if (success) {
        setStatus("Object successfully rented.");
      }
      else {
        setStatus("Renting object not possible. Please try again.");
      }
    }).catch(function (e) {
      console.log(e);
      setStatus("Error renting object; see log.");
    });

  }).catch(function (e) {
    console.log(e);
    setStatus("Error executing getObjectPrice()");
  });
}
