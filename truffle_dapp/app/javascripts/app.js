var accounts;
var account;
var balance;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalance() {
  var meta = MetaCoin.deployed();

  meta.getBalance.call(account, {from: account}).then(function(value) {
    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });
};

function sendCoin() {
  var meta = MetaCoin.deployed();

  var amount = parseInt(document.getElementById("amount").value);
  var receiver = document.getElementById("receiver").value;

  setStatus("Initiating transaction... (please wait)");

  meta.sendCoin(receiver, amount, {from: account}).then(function() {
    setStatus("Transaction complete!");
    refreshBalance();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

// objectApp javascript code

function refreshStatus() {
  var rentable = RentableObjects.deployed();

  var addressElement = document.getElementById("address");
  addressElement.innerHTML = account;

  rentable.objectIsRegistered.call(account, {from: account}).then(function(value) {
    var registeredElement = document.getElementById("registered");
    var registerPage = document.getElementById("registerPage");
    var unregisterPage = document.getElementById("unregisterPage");

    if (value) {
      registeredElement.innerHTML = "";
      registerPage.style.display = "none";
      unregisterPage.style.display = "inline";
    }
    else {
      registeredElement.innerHTML = "not ";
      registerPage.style.display = "inline";
      unregisterPage.style.display = "none";
    }
    }).catch(function(e) {
      console.log(e);
      setStatus("Error getting objectRegistered()");
    });

  rentable.objectIsRented.call(account, {from: account}).then(function(value) {
    var registeredElement = document.getElementById("rented");
    if (value)
      registeredElement.innerHTML = "";
    else
      registeredElement.innerHTML = "not ";
    }).catch(function(e) {
      console.log(e);
      setStatus("Error getting objectRegistered()");
    });

};

function registerObject() {
  var rentable = RentableObjects.deployed();

  var price = parseInt(document.getElementById("price").value);
  var amortizationPeriod = parseInt(document.getElementById("amortizationPeriod").value);
  var description = document.getElementById("description").value;

  setStatus("Registering object... (please wait)");

  rentable.addObject(price, description, {from: account}).then(function(success) {
    if (success) {
      setStatus("New object registered successfully.");
      refreshStatus();
    }
    else {
      setStatus("Object registering not possible. Please try again.");
      refreshStatus();
    }
  }).catch(function(e) {
    console.log(e);
    setStatus("Error registering object; see log.");
  });
};

function unregisterObject() {
  var rentable = RentableObjects.deployed();

  setStatus("Unregistering object... (please wait)");

  rentable.removeObject({from: account}).then(function(success) {
    if (success) {
      setStatus("Object removed successfully.");
      refreshStatus();
    }
    else {
      setStatus("Unregistering object not possible. Please try again.");
      refreshStatus();
    }
  }).catch(function(e) {
    console.log(e);
    setStatus("Error unregistering object; see log.");
  });
};
