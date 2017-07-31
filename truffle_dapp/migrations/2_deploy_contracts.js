var RentableObjects = artifacts.require("RentableObjects.sol");

module.exports = function(deployer) {
  deployer.deploy(RentableObjects);
};