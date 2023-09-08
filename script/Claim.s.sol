// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {Claim} from "../src/Claim.sol";

contract ClaimScript is Script {
    function setUp() public {}

     function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        Claim claim = new Claim();
        console2.log(address(claim));
        vm.stopBroadcast();
    }
}
