contract RentableObjects {

  struct Client {
    address cliAddress;
    string contactInfo;
    uint since;
    bool exists;
  }

  // Every rentable object has the following properties
  struct Object {
    uint price;
    string description;
    uint objId;
    Client client;
    uint created;
    uint amortizationPeriod;
    bool exists;
  }

  // Public index to reference objects
  mapping (uint => Object) objects;

  // Constructor
  function RentableObjects() {

  }

  function objectIsRegistered(uint _objId) returns (bool) {
    return objects[_objId].exists;
  }

  function addObject(uint _objId, uint _price, string _descr) returns (bool) {
    if (objectIsRegistered(_objId) == false) {
      Client memory nilClient = Client({cliAddress: 0, contactInfo: "", since: 0, exists: false});
      objects[_objId] = Object({price: _price, description: _descr, objId: _objId, client: nilClient, created: now, amortizationPeriod: 4 days, exists: true});
      return true;
    }
    else {
      return false;
    }
  }

  function objectIsRented(uint _objId) returns (bool) {
    if ( (objects[_objId].exists == true) && (objects[_objId].client.exists == true) ) {
      return true;
    }
    else {
      return false;
    }
  }

  function removeObject(uint _objId) returns (bool) {
    if ( (objects[_objId].exists == true) && (objectIsRented(_objId) == false) ) {
      delete objects[_objId];
      return true;
    }
    else {
      return false;
      throw;
    }
  }

  function getObjectPrice(uint _objId) returns(uint) {
    // TODO: SOMETHING WRONG WITH CALCULATION!
    /* example for linear degression of price
      |------
      |      --|---
      |________|___------______|
      |        |               |
  [created]  [now]     [created+amortizationPeriod]
      calculated by:
      objPrice = price * ( 1 - ( (now - created) / amortizationPeriod ) )
    */
    uint subtrahend = ( (1000 * (now - objects[_objId].created)) / objects[_objId].amortizationPeriod );
    if (subtrahend > 1000) {
      return 0;
    }
    else {
      uint _price = ( objects[_objId].price * (1000 - subtrahend) ) / 1000;
      return _price;
    }
  }

  function rentObject(uint _objId, string _contactInfo) returns (bool) {
    // if ( (objectIsRented(_objId) == false) && (msg.value >= getObjectPrice(_objId)) ) {
    if (msg.value >= getObjectPrice(_objId)) {
      // add client to object
      objects[_objId].client = Client({cliAddress: msg.sender, contactInfo: _contactInfo, since: now, exists: true});
      // send back any excess ether
      objects[_objId].client.cliAddress.send(msg.value - getObjectPrice(_objId));
      // send confirmation to object
      //objects[_objId].objId.call.value(0)(objects[_objId].client.cliAddress);
      return true;
    }
    else {
      throw;
      return false;
    }
  }

  function returnObject(uint _objId) returns (bool) {
    if ( (objectIsRented(_objId) == true) && (msg.sender == getObjectClientAddress(_objId)) ) {
      objects[_objId].client = Client({cliAddress: 0, contactInfo: "", since: 0, exists: false});
      msg.sender.send(getObjectPrice(_objId));
       return true;
    }
    else {
      throw;
      return false;
    }
  }
  
  function getObjectClientAddress(uint _objId) returns (address) {
    return objects[_objId].client.cliAddress;
  }

  function getObjectClientContactInfo(uint _objId) returns (string) {
    return objects[_objId].client.contactInfo;
  }

  function getObjectDescription(uint _objId) returns (string) {
    return objects[_objId].description;
  }

  function getObjectClientExists(uint _objId) returns (bool) {
    return objects[_objId].client.exists;
  }

  function getObjectClientTime(uint _objId) returns (uint) {
    return now - objects[_objId].client.since;
  }

  // Fallback function results in nothing
  function () {
    throw;
  }

}
