
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StudyDAO", (m) => {

  const StudyDAO = m.contract("StudyDAO",["0x59F78eA4dB7CC9d5f55Ff7824C498836c7539310"]);

  return {
    StudyDAO,
  };
});
