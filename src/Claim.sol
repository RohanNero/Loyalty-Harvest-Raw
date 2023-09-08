// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error Claim__RewardsPeriodHasntEnded();
error Claim__AlreadyClaimed();
error Claim__InvalidProof();
error Claim__InvalidTimestamps();
error Claim__RewardTransferFailed();
error Claim__MustProvideRootIfContestIsOver();
error Claim__InvalidSigner();

/**@title Claim
 *@author Rohan Nero
 *@notice this contract allows anyone claim rewards earned during a `reward period`
 *@dev root - 0x0xe4d847cc5eac373cd9f985335891478d60b2be66e1bb6bda7dc0c0685610fc6a */
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

    /**@notice each struct outlines the details of a reward event
     *@dev nftContract - the ERC721 contract
     *@dev rewardToken - the current that reward will be in, set to 0 address to use ETH
     *@dev blockStart - the block number that the reward event starts at
     *@dev blockEnd - the block number that the reward event ends at
     *@dev rewardAmount - the amount of ETH
     *@dev */
    struct RewardEvent {
        address nftContract;
        address rewardToken;
        address organizer;
        bytes32 merkleRoot;
        uint startBlock;
        uint endBlock;
        uint rewardAmount;
        uint holders;
        uint eventId;
    }

    /**@notice array from eventId to RewardEvent */
    RewardEvent[] public eventMap;

    /**@notice tracks whether or not rewards have been claimed for an NFT or not
     *@dev set to true inside `claim()` */
    mapping(uint eventId => mapping(uint tokenId => bool hasClaimed))
        public claimMap;

    /**@notice admin would set these values, public for testing ease */
    function setTimestamps(
        uint id,
        uint startTimestamp,
        uint endTimestamp
    ) public {
        if (endTime < startTime + 3 days) {
            revert Claim__InvalidTimestamps();
        }
        eventMap[id].startBlock = startTimestamp;
        eventMap[id].endBlock = endTimestamp;
    }

    /**@notice admin would set this value, public for testing ease
     *@dev to ensure transparency this should be publicly known and so should the entire Merkle tree */
    function setRoot(bytes32 merkleRoot) public {
        root = merkleRoot;
    }

    /**@notice anyone would be able to claim after the endTime
     *@dev this needs to use `MerkleProof` lib to verify that the caller can receieve funds
     *@param proof is an array of proofs that can be used to verifiy the user's claim
     *@param signature contains hash of holder, tokenId, eventId, heldUntil
     *@param holder is the address that held the NFT
     *@param to is the address that will be sent the rewards
     *@param tokenId is the NFT's tokenId
     *@param eventId is the `RewardEvent` index in the `eventMap`
     *@param heldUntil is the block number the NFT was held until
     */
    function claimWithSignature(
        bytes32[] memory proof,
        bytes memory signature,
        address holder,
        address to,
        uint tokenId,
        uint eventId,
        uint heldUntil
    ) public returns (uint) {
        // ensure the event has ended
        if (block.number < eventMap[eventId].endBlock) {
            revert Claim__RewardsPeriodHasntEnded();
        }
        // ensure the user hasn't already claimed for this event and tokenId
        if (claimMap[eventId][tokenId]) {
            revert Claim__AlreadyClaimed();
        }

        // Want to do the Merkle proof stuff here

        // Recover the signer's address

        // create the message hash
        bytes32 messageHash = keccak256(
            abi.encodePacked(holder, tokenId, eventId, heldUntil)
        );
        // sign the message hash
        bytes32 signedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        // recover the signer
        address signer = recoverSigner(signedMessageHash, signature);

        // revert if signer address isn't the holder
        if (signer != holder) {
            revert Claim__InvalidSigner();
        }

        // UPDATED PORTION OF LOGIC ENDS HERE, EVERYTHING BELOW NEEDS UPDATING

        // Calculate the user's `leaf` hash
        bytes32 leaf = keccak256(
            abi.encodePacked(msg.sender, tokenId, heldUntil)
        );

        // Use MerkleProof lib to verify proof with root and leaf
        bool verified = MerkleProof.verify(
            proof,
            eventMap[eventId].merkleRoot,
            leaf
        );

        // Revert if the verification returns false
        if (!verified) {
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
        if (success) {
            return (eligibleFor);
        } else {
            revert Claim__RewardTransferFailed();
        }
    }

    /**@notice anyone can call this function to create a reward event
     *@dev _root may be set to 0 if waiting until reward period to add */
    function createRewardEvent(
        address _nftContract,
        address _rewardToken,
        address _organizer,
        bytes32 _root,
        uint _blockStart,
        uint _blockEnd,
        uint _rewardAmount,
        uint _holders
    ) public {
        // if event period is over, root has to be set
        if (block.number > _blockEnd && _root == 0) {
            revert Claim__MustProvideRootIfContestIsOver();
        }

        // add the struct to the eventMap
        eventMap.push(
            RewardEvent(
                _nftContract,
                _rewardToken,
                _organizer,
                _root,
                _blockStart,
                _blockEnd,
                _rewardAmount,
                _holders,
                eventMap.length
            )
        );
    }

    /** View / pure functions */

    /**@notice returns the duration of the reward period in seconds */
    function viewRewardPeriodDuration() public view returns (uint) {
        return endTime - startTime;
    }

    /**@notice retursn the duration that a user held an NFT for in seconds */
    function viewHeldTime(uint heldUntil) public view returns (uint) {
        return heldUntil - startTime;
    }

    function recoverSigner(
        bytes32 _signedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_signedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }
}
