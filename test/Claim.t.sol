// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Claim} from "../src/Claim.sol";

contract ClaimTest is Test {
    Claim public claim;

    function setUp() public {
        claim = new Claim();
    }

  
    // function testFuzz_SetNumber(uint256 x) public {
    //     assertEq(claim.number(), x);
    // }
}
