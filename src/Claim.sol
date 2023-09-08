// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error Claim__RewardsPeriodHasntEnded();
error Claim__AlreadyClaimed();
error Claim__InvalidProof();
error Claim__InvalidTimestamps();
error Claim__RewardTransferFailed();

contract Claim {
    
    /**@notice variables for reward period duration */
    uint public startTime;
    uint public endTime;

    /**@notice maximum amount of rewards a user could receive
      *@dev a user would have to have held the NFT the entire rewards period duration to get this */
    uint public maxReward = 777e18;


    /**@notice variables for Merkle Proof */

    /**@notice users can calculate the Merkle Proof off-chain by inputting their leaf with the root 
      *@dev this won't be an actual contract variable since it varies by user, just here for dev */
    //bytes32[] public proof;

    /**@notice root - The Merkle root is the hash of all leaves in the Merkle tree */
    bytes32 public root;
    
    /**@notice leaf - The leaf hash is the hash of the user's data that you want to prove 
      *@dev this won't be an actual contract variable since it varies by user, just here for dev */
    //bytes32 public leaf;


    
    /**@notice tracks if the user has claimed already or not */
    mapping(address holder => bool hasClaimed) public claimMap;

    /**@notice admin would set these values, public for testing ease */
    function setTimestamps(uint startTimestamp, uint endTimestamp) public {
        if(endTime < startTime + 3 days) {
            revert Claim__InvalidTimestamps();
        }
        startTime = startTimestamp;
        endTime = endTimestamp;
    }

    /**@notice admin would set this value, public for testing ease 
      *@dev to ensure transparency this should be publicly known and so should the entire Merkle tree */
    function setRoot(bytes32 merkleRoot) public {
        root = merkleRoot;
    }

    /**@notice admin would set this value, public for testing ease */
    function setMaxReward(uint max) public {
        maxReward = max;
    }

    /**@notice anyone would be able to claim after the endTime 
      *@dev this needs to use `MerkleProof` lib to verify that the caller can receieve funds */
    function claim(bytes32[] memory proof, uint tokenId, uint heldUntil) public returns(uint) {
        if(block.timestamp < endTime) {
            revert Claim__RewardsPeriodHasntEnded();
        }
        if(claimMap[msg.sender]) {
            revert Claim__AlreadyClaimed();
        }

        // Want to do the Merkle proof stuff here

        // Calculate the user's `leaf` hash
        bytes32 leaf = keccak256(abi.encode(msg.sender, tokenId, heldUntil));

        // Use MerkleProof lib to verify proof with root and leaf
        bool verified = MerkleProof.verify(proof, root, leaf);

        // Revert if the verification returns false
        if(!verified) {
            revert Claim__InvalidProof();
        }

        // Calculate how much rewards the user has earned
        // duration - 100 seconds
        // heldUntil - 50 seconds
        // 50 / 100 = 0.5 amount of the rewards
        // add 8 0s to the end of the number for solidity math purposes
        uint adjustedDuration = viewRewardPeriodDuration() * 10 ** 8;
        uint adjustedHeld = viewHeldTime(heldUntil) * 10 ** 8;
        uint portion = adjustedHeld / adjustedDuration;
        uint eligibleFor = (maxReward * portion) / 10 ** 8;
        
        // send the `eligibleFor` amount of ETH to the caller
        (bool success, ) = msg.sender.call{value: eligibleFor}("");
        if(success) {
            return(eligibleFor);
        } else {
            revert Claim__RewardTransferFailed();
        }
    }
   

    /**@notice returns the duration of the reward period in seconds */
    function viewRewardPeriodDuration() public view returns(uint) {
        return endTime - startTime;
    }

    /**@notice retursn the duration that a user held an NFT for in seconds */
    function viewHeldTime(uint heldUntil) public view returns(uint) {
        return heldUntil - startTime;
    }
}
