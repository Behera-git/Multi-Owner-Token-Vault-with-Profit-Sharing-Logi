// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract VaultSplit {
    address[] public owners;
    mapping(address => uint256) public shares;
    uint256 public totalShares;

    event DepositReceived(address indexed from, uint256 amount);
    event ProfitsDistributed(uint256 totalAmount);
    event OwnerAdded(address indexed owner, uint256 share);

    modifier onlyOwner() {
        require(shares[msg.sender] > 0, "Not an owner");
        _;
    }

    constructor() {
        // Hardcoded owners and shares (replace with your addresses)
        address[3] memory defaultOwners = [
            0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2,  // Owner 1 (40%)
            0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db,  // Owner 2 (30%)
            0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB   // Owner 3 (30%)
        ];
        uint256[3] memory defaultShares = [
            uint256(40),  // Explicit uint256
            uint256(30),
            uint256(30)
        ];

        // Initialize owners and shares
        for (uint256 i = 0; i < defaultOwners.length; i++) {
            owners.push(defaultOwners[i]);
            shares[defaultOwners[i]] = defaultShares[i];
            totalShares += defaultShares[i];
            emit OwnerAdded(defaultOwners[i], defaultShares[i]);
        }
    }

    receive() external payable {
        emit DepositReceived(msg.sender, msg.value);
    }

    function distributeProfits() external onlyOwner {
        require(address(this).balance > 0, "No balance to distribute");
        uint256 balance = address(this).balance;

        for (uint256 i = 0; i < owners.length; i++) {
            address owner = owners[i];
            uint256 payment = (balance * shares[owner]) / totalShares;
            payable(owner).transfer(payment);
        }

        emit ProfitsDistributed(balance);
    }
}
