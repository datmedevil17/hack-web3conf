
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DAOToken", (m) => {

  const DAOToken = m.contract("DAOToken");

  return {
    DAOToken,
  };
});
