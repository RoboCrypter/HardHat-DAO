// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;


import "@openzeppelin/contracts/governance/TimelockController.sol";


contract TimeLock is TimelockController {

    constructor(
        uint256 minimumDelay,           //  minimumDelay: How long you have to wait before executing the proposal.
        address[] memory proposers,     //  proposers: The list of addresses to be granted the proposer and canceller roles.
        address[] memory executors,     //  executors: The list of addresses to be granted the executor role.
        address admin                   //  admin: Optional account to be granted admin role. (You can disable it with zero address).
    ) TimelockController(minimumDelay, proposers, executors, admin) {}
}