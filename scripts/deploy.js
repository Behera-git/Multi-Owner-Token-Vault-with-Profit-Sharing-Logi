const hre = require("hardhat");

async function main() {
  const owners = ["0xYourAddress1", "0xYourAddress2"]; // Replace with actual addresses
  const shares = [60, 40]; // Replace with actual share distribution

  const VaultSplit = await hre.ethers.getContractFactory("VaultSplit");
  const vaultSplit = await VaultSplit.deploy(owners, shares);
  await vaultSplit.deployed();

  console.log("VaultSplit deployed to:", vaultSplit.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
