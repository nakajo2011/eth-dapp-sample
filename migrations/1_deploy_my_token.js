const MyToken = artifacts.require("MyToken");
module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(MyToken);
};
