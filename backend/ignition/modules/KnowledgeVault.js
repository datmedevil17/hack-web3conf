
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KnowledgeVault", (m) => {

  const KnowledgeVault = m.contract("KnowledgeVault",["0x0B3cbed9B5E4CE0921751CBDeF7639B1c7B3a881"]);

  return {
    KnowledgeVault,
  };
});
