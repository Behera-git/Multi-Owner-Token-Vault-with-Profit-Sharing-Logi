const contractAddress = "0x52451BBC636905571273083D7fE10f32A54628f6"; // Your deployed contract
const contractABI = [
  // Minimal ABI (adjust to your contract)
  "function deposit() external payable",
  "function distributeProfits() external",
  "function getVaultBalance() public view returns (uint256)"
];

let provider, signer, contract;

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = `Connected: ${address}`;
  } else {
    alert("MetaMask not detected!");
  }
}

async function depositETH() {
  const amount = document.getElementById("depositAmount").value;
  if (!amount || amount <= 0) return alert("Enter valid ETH amount");

  try {
    const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    alert("Deposit successful!");
  } catch (err) {
    console.error(err);
    alert("Deposit failed");
  }
}

async function distributeProfits() {
  try {
    const tx = await contract.distributeProfits();
    await tx.wait();
    alert("Profits distributed!");
  } catch (err) {
    console.error(err);
    alert("Distribution failed");
  }
}

async function getVaultBalance() {
  try {
    const balance = await contract.getVaultBalance();
    const ethBalance = ethers.utils.formatEther(balance);
    document.getElementById("vaultBalance").innerText = `Balance: ${ethBalance} ETH`;
  } catch (err) {
    console.error(err);
    alert("Error fetching balance");
  }
}

// Event listeners
document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("depositBtn").onclick = depositETH;
document.getElementById("distributeBtn").onclick = distributeProfits;
document.getElementById("getBalanceBtn").onclick = getVaultBalance;
