// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {console2} from "forge-std/Test.sol";

error Claim__RewardsPeriodHasntEnded(uint current, uint end);
error Claim__AlreadyClaimed();
error Claim__InvalidProof();
error Claim__InvalidTimestamps();
error Claim__RewardTransferFailed();
error Claim__MustProvideRootIfContestIsOver();
error Claim__InvalidSigner();
error Claim__MustSendRewardAmount();
error Claim__InvalidCaller();

/**@title Claim
 *@author Rohan Nero
 *@notice this contract allows anyone claim rewards earned during a `reward period`
 *@dev only compatible with ERC-721 compliant contracts
 */
contract Claim {
    /**@notice each struct outlines the details of a reward event
     *@dev nftContract - the ERC721 contract
     *@dev rewardToken - the current that reward will be in, set to 0 address to use ETH
     *@dev blockStart - the block number that the reward event starts at
     *@dev blockEnd - the block number that the reward event ends at
     *@dev rewardAmount - the amount of ETH
     *@dev nfts - total amount of different NFTs
     *@dev
     */
    struct RewardEvent {
        address nftContract;
        address rewardToken;
        address organizer;
        bytes32 merkleRoot;
        uint startBlock;
        uint endBlock;
        uint rewardAmount;
        uint nfts;
        uint eventId;
    }

    /**@notice used to avoid stack-too-deep error
     *@param holder is the address that held the NFT
     *@param to is the address that will be sent the rewards
     *@param tokenId is the NFT's tokenId
     *@param eventId is the `RewardEvent` index in the `eventMap`
     *@param heldUntil is the block number the NFT was held until*/
    struct ClaimInfo {
        address holder;
        address to;
        uint tokenId;
        uint eventId;
        uint heldUntil;
    }

    /**@notice array from eventId to RewardEvent */
    RewardEvent[] public eventMap;

    /**@notice tracks whether or not rewards have been claimed for an NFT or not
     *@dev set to true inside `claim()` */
    mapping(uint eventId => mapping(uint tokenId => bool hasClaimed))
        public claimMap;

    /**@notice anyone can claim after the endTime
     *@dev this uses `MerkleProof` lib to verify that the caller can receieve funds
     *@dev the signature must belong to the holder of the NFT
     *@param proof is an array of proofs that can be used to verifiy the user's claim
     *@param signature contains hash of holder, tokenId, eventId, heldUntil
     *@param info is the ClaimInfo struct containing information about the claim
     */
    function claimWithSignature(
        bytes32[] memory proof,
        bytes memory signature,
        ClaimInfo memory info
    ) public returns (uint) {
        // ensure the event has ended
        if (block.number < eventMap[info.eventId].endBlock) {
            revert Claim__RewardsPeriodHasntEnded(
                block.number,
                eventMap[info.eventId].endBlock
            );
        }
        // ensure the user hasn't already claimed for this event and tokenId
        if (claimMap[info.eventId][info.tokenId]) {
            revert Claim__AlreadyClaimed();
        }

        // Recover the signer's address

        // create the message hash
        bytes32 messageHash = keccak256(abi.encodePacked(info.to));
        // sign the message hash
        bytes32 signedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        // recover the signer
        address signer = _recoverSigner(signedMessageHash, signature);

        // revert if signer address isn't the holder
        if (signer != info.holder) {
            revert Claim__InvalidSigner();
        }

        uint portion = _claim(proof, info);
        return portion;
    }

    /**@notice anyone can claim after the endTime
     *@dev this uses `MerkleProof` lib to verify that the caller can receieve funds
     *@dev msg.sender must be the address that held the NFT
     *@param proof is an array of proofs that can be used to verifiy the user's claim
     *@param info is the ClaimInfo struct containing information about the claim
     */
    function claim(
        bytes32[] memory proof,
        ClaimInfo memory info
    ) public returns (uint) {
        // ensure the event has ended
        if (block.number < eventMap[info.eventId].endBlock) {
            revert Claim__RewardsPeriodHasntEnded(
                block.number,
                eventMap[info.eventId].endBlock
            );
        }
        // ensure the user hasn't already claimed for this event and tokenId
        if (claimMap[info.eventId][info.tokenId]) {
            revert Claim__AlreadyClaimed();
        }
        // ensure that msg.sender is the holder of the NFT
        if (msg.sender != info.holder) {
            revert Claim__InvalidCaller();
        }
        uint portion = _claim(proof, info);
        return portion;
    }

    /**@notice anyone can call this function to create a reward event
     *@dev _root may be set to 0 if waiting until reward period to add
     *@param _nftContract is the ERC-721 contract associated with the Reward Event
     *@param _rewardToken is the token to be sent as rewards
     *@param _organizer is the address that created the Reward Event
     *@param _root is the Merkle Root of the Reward Event
     *@param _blockStart is the block number that the Reward Event started at
     *@param _blockEnd is the block number that the Reward Event ended at
     *@param _rewardAmount is the amount of reward token to be sent to the holders
     *@param _nfts is the total amount of NFTs eligible for rewards
     */
    function createRewardEvent(
        address _nftContract,
        address _rewardToken,
        address _organizer,
        bytes32 _root,
        uint _blockStart,
        uint _blockEnd,
        uint _rewardAmount,
        uint _nfts
    ) public payable {
        // if event period is over, root has to be set
        if (block.number > _blockEnd && _root == 0) {
            revert Claim__MustProvideRootIfContestIsOver();
        }
        // conditional to ensure that the organizer sends the funds

        // msg.value if native ETH
        if (_rewardToken == address(0)) {
            if (msg.value < _rewardAmount) {
                revert Claim__MustSendRewardAmount();
            }
        }
        // `transferFrom` for ERC-20
        else {
            IERC20(_rewardToken).transferFrom(
                _organizer,
                address(this),
                _rewardAmount
            );
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
                _nfts,
                eventMap.length
            )
        );
    }

    /** View / pure functions */

    /**@notice returns the duration of the reward period in blocks */
    function viewRewardPeriodDuration(uint eventId) public view returns (uint) {
        return eventMap[eventId].endBlock - eventMap[eventId].startBlock;
    }

    /**@notice returns this contract's entire eth balance */
    function viewEthBalance() public view returns (uint) {
        return address(this).balance;
    }

    /**@notice returns length of `eventMap` */
    function viewEventMapLength() public view returns (uint) {
        return eventMap.length;
    }

    /**@notice recovers the signer
     *@dev from SMP's signature recovery */
    function _recoverSigner(
        bytes32 _signedMessageHash,
        bytes memory _signature
    ) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(_signature);

        return ecrecover(_signedMessageHash, v, r, s);
    }

    /**@notice splits the signature
     *@dev from SMP's signature recovery */
    function _splitSignature(
        bytes memory sig
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
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

    /**@notice internal claim function that actually verifies `proof` and sends rewards */
    function _claim(
        bytes32[] memory proof,
        ClaimInfo memory info
    ) internal returns (uint) {
        // Calculate the user's `leaf` hash
        bytes32 leaf = keccak256(
            bytes.concat(
                keccak256(
                    abi.encode(
                        info.holder,
                        info.tokenId,
                        info.eventId,
                        info.heldUntil
                    )
                )
            )
        );
        console2.log("leaf:");
        console2.logBytes32(leaf);
        console2.log("root:");
        console2.logBytes32(eventMap[info.eventId].merkleRoot);
        console2.log("proof:");
        console2.logBytes32(proof[0]);
        console2.logBytes32(proof[1]);

        // Use MerkleProof lib to verify proof with root and leaf
        bool verified = MerkleProof.verify(
            proof,
            eventMap[info.eventId].merkleRoot,
            leaf
        );

        // Revert if the verification returns false
        if (!verified) {
            revert Claim__InvalidProof();
        }
        // Reward calculation

        // calculate maxPortion that an NFT could earn its holder
        // 1 Ether / 10 nfts = 0.1 ether per NFT
        // maxPortion uses 6 decimals
        uint maxPortion = (eventMap[info.eventId].rewardAmount * 10 ** 6) /
            eventMap[info.eventId].nfts;

        // calculate what percent of the maxPortion they should get
        // total = 100, blocksHeld = 77
        // percent = blocksHeld / total
        uint totalBlocks = eventMap[info.eventId].endBlock -
            eventMap[info.eventId].startBlock;
        uint blocksHeld = info.heldUntil - eventMap[info.eventId].startBlock;
        uint percent = (blocksHeld * 10 ** 6) / totalBlocks;

        // now that we know the maxPortion they could get, lets see how much they actually earned
        uint portion = (maxPortion * percent) / 1e12;
        console2.log("portion:", portion);

        // Now that we know the `portion` is, we can send it to the user

        // transfer ETH if rewardToken isn't set
        if (eventMap[info.eventId].rewardToken == address(0)) {
            console2.log("transfer eth");
            (bool success, ) = info.to.call{value: portion}("");
            // ensure call went through
            if (!success) {
                revert Claim__RewardTransferFailed();
            }
        }
        // Transfer token if its an ERC20
        else {
            bool success = IERC20(eventMap[info.eventId].rewardToken).transfer(
                info.to,
                portion
            );
            if (!success) {
                revert Claim__RewardTransferFailed();
            }
        }
        claimMap[info.eventId][info.tokenId] == true;
        return portion;
    }
}
