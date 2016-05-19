contract RentableObjects {

  struct Client {
    address cliAddress;
    string contactInfo;
    bool exists;
  }

  // Every rentable object has the following properties
  struct Object {
    uint price;
    string description;
    address objAddress;
    Client client;
    uint created;
    uint amortizationPeriod;
    bool exists;
  }

  // Public index to reference objects
  mapping (address => Object) objects;

  // Constructor
  function RentableObjects() {

  }

  function objectIsRegistered(address _objAddress) returns (bool) {
    return objects[_objAddress].exists;
  }

  function addObject(uint _price, string _descr) returns (bool) {
    if (objectIsRegistered(msg.sender) == false) {
      Client memory nilClient = Client({cliAddress: 0, contactInfo: "", exists: false});
      objects[msg.sender] = Object({price: _price, description: _descr, objAddress: msg.sender, client: nilClient, created: now, amortizationPeriod: 4 minutes, exists: true});
      return true;
    }
    else {
      return false;
    }
  }

  function objectIsRented(address _objAddress) returns (bool) {
    if ( (objects[_objAddress].exists == true) && (objects[_objAddress].client.exists == true) ) {
      return true;
    }
    else {
      return false;
    }
  }

  function removeObject() returns (bool) {
    // TODO: check for rented status
    if (objects[msg.sender].exists == true) {
      delete objects[msg.sender];
      return true;
    }
    else {
      return false;
      throw;
    }
  }

  function getObjectPrice(address _objAddress) returns(uint) {
    /* example for linear degression of price
      |------
      |      --|---
      |________|___------______|
      |        |               |
  [created]  [now]     [created+amortizationPeriod]
      calculated by:
      objPrice = price * ( 1 - ( (now - created) / amortizationPeriod ) )
    */
    uint subtrahend = ( (1000 * (now - objects[_objAddress].created)) / objects[_objAddress].amortizationPeriod );
    if (subtrahend > 1000) {
      return 0;
    }
    else {
      uint _price = ( objects[_objAddress].price * (1000 - subtrahend) ) / 1000;
      return _price;
    }
  }

  function rentObject(address _objAddress, string _contactInfo) returns (bool) {
    if ( (objectIsRented(_objAddress) == false) && (msg.value >= getObjectPrice(_objAddress)) ) {
      // add client to object
      objects[_objAddress].client = Client({cliAddress: msg.sender, contactInfo: _contactInfo, exists: true});
      // send back any excess ether
      objects[_objAddress].client.cliAddress.send(msg.value - objects[_objAddress].price);
      // send confirmation to object
      objects[_objAddress].objAddress.call.value(0)(objects[_objAddress].client.cliAddress);
      return true;
    }
    else {
      return false;
      throw;
    }
  }

  function getObjectClientAddress(address _objAddress) returns (address) {
    return objects[_objAddress].client.cliAddress;
  }

  function getObjectClientContactInfo(address _objAddress) returns (string) {
    return objects[_objAddress].client.contactInfo;
  }

  function getObjectDescription(address _objAddress) returns (string) {
    return objects[_objAddress].description;
  }

  function getObjectClientExists(address _objAddress) returns (bool) {
    return objects[_objAddress].client.exists;
  }

  // Fallback function results in nothing
  function () {
    throw;
  }

}
