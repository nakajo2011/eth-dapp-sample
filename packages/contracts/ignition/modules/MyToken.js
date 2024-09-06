const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const INITIAL_SUPPLY = 1_000_000_000_000_000n;

module.exports = buildModule("MyTokenModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", INITIAL_SUPPLY);

  const token = m.contract("MyToken", [initialSupply], {});

  return { token };
});