// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IZkSync.sol";

contract Lock {

    address public tokenAddress;
    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }
    
    function lock(
        uint256 tokenId,
        address zkSyncAddress,
        address contractAddr,
        bytes memory data,
        uint256 gasLimit,
        uint256 gasPerPubdataByteLimit
    ) external payable {
        // transfer token to self
        IERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId);

        // call bridge contract
        IZkSync zksync = IZkSync(zkSyncAddress);
        zksync.requestL2Transaction{value: msg.value}(contractAddr, 0, 
            data, gasLimit, gasPerPubdataByteLimit, new bytes[](0), msg.sender);
    }
}
