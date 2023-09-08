// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {NFT} from "../src/NFT.sol";

contract NFTScript is Script {

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        NFT nft = new NFT("NonFun", "NFT");
        console2.log(address(nft));
        vm.stopBroadcast();
    }
}
