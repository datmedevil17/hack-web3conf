
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("STDToken", (m) => {

  const STDToken = m.contract("STDToken");

  return {
    STDToken,
  };
});
