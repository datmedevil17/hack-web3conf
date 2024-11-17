const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
module.exports = buildModule("StudyDAO", (m) => {
  const StudyDAO = m.contract("StudyDAO", []);
  return { StudyDAO };
});
