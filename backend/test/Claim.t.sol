// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Claim} from "../src/Claim.sol";
import {NFT} from "../src/NFT.sol";

/**@notice this contract deploys `NFT` and `Claim`, and then tests to ensure Claim works */
contract ClaimTest is Test {
    Claim public claim;
    NFT public nft;

    /**@notice create contract objects to test against */
    function setUp() public {
        vm.startPrank(0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E);
        claim = new Claim();
        nft = new NFT("NonFun", "NFT");
        vm.stopPrank();
    }

    /**@notice test creating reward event
     *@dev organizer - 0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E
     *@dev root - 0x28fc3e08e808beb1aabd8d074622c815e9827c99ba812cf6cb9b319e932822d1
     */
    function test_CreateRewardEvent() public {
        uint pre = claim.viewEventMapLength();
        claim.createRewardEvent{value: 100}(
            address(nft),
            address(0),
            0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E,
            0x28fc3e08e808beb1aabd8d074622c815e9827c99ba812cf6cb9b319e932822d1,
            block.number,
            block.number + 10,
            100,
            4
        );
        uint post = claim.viewEventMapLength();
        assertEq(pre + 1, post);
    }

    /**@notice test a user claiming their rewards
     *@dev first NFT earns user earns 100% of rewards 
     *@dev proof - [
  '0x9cd3b8d6ac952a038694bf75aa9351c88d6528d5e10a1373a688ea0e905cf79e',
  '0xee4505a5486f5a4a5e5de78d95c8869d107b173e5e40fec5b238094a1dc0b868'
]
     *@dev signature - 0x50f0d49ca2ef405a54332a683c8a30746ec337f58835fc8e52ca0791cbfa50ae7240ce5d9d7cd9e2615f40c86639e58a2d378f78e87fc3a2e82d4f6165d977061b
     *@dev info - [0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E, 0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E, 0, 0, 110]
        address holder;
        address to;
        uint tokenId;
        uint eventId;
        uint heldUntil;
*/
    function test_ClaimWithSignature() public {
        vm.roll(100);
        test_CreateRewardEvent();
        vm.roll(110);
        uint preBal = claim.viewEthBalance();
        console2.log("preBal:", preBal);
        uint preNftBal = nft.balanceOf(
            0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E
        );
        console2.log("preNftBal:", preNftBal);
        bytes32[] memory proof = new bytes32[](2);
        proof[0] = bytes32(
            0x9cd3b8d6ac952a038694bf75aa9351c88d6528d5e10a1373a688ea0e905cf79e
        );
        proof[1] = bytes32(
            0xee4505a5486f5a4a5e5de78d95c8869d107b173e5e40fec5b238094a1dc0b868
        );

        bytes
            memory signature = hex"50f0d49ca2ef405a54332a683c8a30746ec337f58835fc8e52ca0791cbfa50ae7240ce5d9d7cd9e2615f40c86639e58a2d378f78e87fc3a2e82d4f6165d977061b";
        Claim.ClaimInfo memory claimInfo = Claim.ClaimInfo({
            holder: 0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E,
            to: 0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E,
            tokenId: 0,
            eventId: 0,
            heldUntil: 110
        });
        // Since the first user we are testing held their NFT the entire reward duration,
        // they should receive the entire portion availiable to them, which is 25% of 100 WEI
        // 25% because there are 4 total NFTs in the RewardEvent struct; splitting x reward between 4 people.
        // 100 WEI because that is the total reward for the event
        uint reward = claim.claimWithSignature(proof, signature, claimInfo);
        console2.log("reward:", reward);
        assertEq(reward, 25);
    }

    /**@notice test a user claiming their rewards
     *@dev uses the same params from above excluding the `signature` */
    function test_Claim() public {
        vm.roll(100);
        test_CreateRewardEvent();
        vm.roll(110);
        uint preBal = claim.viewEthBalance();
        console2.log("preBal:", preBal);
        uint preNftBal = nft.balanceOf(
            0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E
        );
        console2.log("preNftBal:", preNftBal);
        bytes32[] memory proof = new bytes32[](2);
        proof[0] = bytes32(
            0x9cd3b8d6ac952a038694bf75aa9351c88d6528d5e10a1373a688ea0e905cf79e
        );
        proof[1] = bytes32(
            0xee4505a5486f5a4a5e5de78d95c8869d107b173e5e40fec5b238094a1dc0b868
        );

        Claim.ClaimInfo memory claimInfo = Claim.ClaimInfo({
            holder: 0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E,
            to: 0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E,
            tokenId: 0,
            eventId: 0,
            heldUntil: 110
        });
        // Since the first user we are testing held their NFT the entire reward duration,
        // they should receive the entire portion availiable to them, which is 25% of 100 WEI
        // 25% because there are 4 total NFTs in the RewardEvent struct; splitting x reward between 4 people.
        // 100 WEI because that is the total reward for the event
        vm.prank(0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E);
        uint reward = claim.claim(proof, claimInfo);
        console2.log("reward:", reward);
        assertEq(reward, 25);
    }
}
