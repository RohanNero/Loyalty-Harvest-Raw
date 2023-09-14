### Quick Notes

## Merkle Proof

For the merkle proof, we want to

1. listen to the NFT contract `Transfer` events
2. hash the `_from` address, the NFT `_tokenId`, the `time.stamp` that the event was fired at
3. add the hash to the merkle tree

For our specific scenario, we will only allow earned rewards to be for users who held the NFT from the `startTimestamp` until a period `x` after the `startTimestamp`, where `x` is `startTimestamp + 1` - `endTimestamp`.

This means

- users who buy NFTs after the `startTimestamp` aren't eligible for rewards
- a user who sells their NFT and then buys it back are only eligible for the time they originally held it before the first `Transfer`

Finally at the `Claim` portion, we will need to ensure that the holder still holds the NFT, this allows us to confirm without a doubt the holder held the NFT through the entire period.

To prove you held and didnt sell the entire rewards period, you will still need to hold the NFT at time of `Claim`?

As opposed to a `listener` this will be just scraping the blockchain for data from a set block timeframe at the end of the rewards period.

Revised plan of action

1. NFT contract is deployed, `Claim` contract can be deployed now or at the end of the rewards period.
2. NFTs are transferred, or not, during the rewards period.
3. `MerkleScrape.js` script is ran to construct a Merkle Tree using data from `startBlock` to `endBlock`.
   - The data grabbed is the `from`, `tokenId`, and `block.timestamp`/`block.number` from the events.
4. After the Merkle tree is constructed, the `root` hash can be inputted to the `Claim` contract (or `Claim` is deployed with `root`)
5. Once the `Claim` contract has a root, users can create `leaf`s using their `address`, `tokenId`, and `heldUntil`
6. After creating a `leaf`, the user can create a `proof` using the `leaf` (and `root`)
7. After obtaining a `proof`, the user can finally call `claim()` with the `proof` and their `leaf`.
   - if the user's proof is valid, they earn rewards proportional to the amount of time they held the NFT.
   - revert otherwise.

## Nft data

Best way to go about grabbing the data would be to

Users will off-chain provide there

1. address that held the NFT
2. tokenId of the NFT they held

## Rewards

Duration in blocks or seconds?

I think the rewards should be tied to an NFT or address

NFT has an amount of rewards it earned during the period, holder, and Id.

If an NFT wasn't sold during the period it earned the maximum amount of rewards.
If an NFT gets sold at 50% of the reward period completion, it gets 50% of the rewards.
These rewards are only allowed to be claimed by the address that held the NFT from the start of the contest --> end/sell time.

1.  calculate the total amount of percentage users could earn
    - for example if there are 1000 NFTs, each nft could earn its holder 0.1% of the reward
2.  calculate the amount of the total reward the user has earned
    - for example if a user held their NFT for 50% of the reward period, they earned 50% of their max percentage, 0.1% would mean 0.05%.
3.  transfer the calculated amount to the user
    - for example, if a `reward event` was 1 eth in prize, a user who held one NFT for 50% of the time gets 0.005 ether.

## Question

What if a contest allowed any address to claim the reward as long as they had the proof created by a leaf and the root, but then the transaction failed to out of gas, would a bot be able to pick this transaction up and steal the funds by copying the input?

How does the `reward event` admin know exactly how much rewards were earned?
Are the rewards based on percentage of a total amount?

- if so, the math would be:
  1.  calculate the total amount of percentage users could earn
      - for example if there are 1000 NFTs, each nft could earn its holder 0.1% of the reward
  2.  calculate the amount of the total reward the user has earned
      - for example if a user held their NFT for 50% of the reward period, they earned 50% of their max percentage, 0.1% would mean 0.05%.
  3.  transfer the calculated amount to the user
      - for example, if a `reward event` was 1 eth in prize, a user who held one NFT for 50% of the time gets 0.005 ether.

## perspective

A smart contract holds 1 Ether in rewards for anyone who holds an NFT from x to z. If you sell before z, at y, you can still earn rewards, but only 50% of the amount you would've received for holding the entire duration.

We want to prove to the smart contract that we held the NFT for x amount of time so we can earn the rewards. Im guessing an admin of the reward smart contract would need to set a `root` after the period has ended.

Then using any off-chain tool to calculate proofs, users can create `leaf`s using information only they know. (aka in blockchain, they would sign the message, since only they have access to create it).

This way the only centralized component after the rewards are sent to the contract would be to set the `root`. Of course we would need to describe the tree so that users know how to construct their `leaf`s as well. Help me construct this Merkle tree and also show me what it would look like phsyically.

## Merkle tree construction

1. create a leaf for every nft holder, the leaf contains the address of the holder, nftId, and heldDuration
2. loop through blockstart - blockend updating `leaf` `heldUntil` by viewing `Transfer` events
   - if NFT id 777 is transferred at block 77, while start = 0 end = 100, heldDuration is set to 77 in the leaf.

## Examples

### First example

Using three hard-coded `leaf`s, with an address, id, and heldUntil block, I've created the merkle tree with the merkle root: `0x0xe4d847cc5eac373cd9f985335891478d60b2be66e1bb6bda7dc0c0685610fc6a`

Using this root and the structure of the leaf, I now want to test a user being allowed to claim rewards based on how long they held the NFT.

To keep it simple this first prototype will just send you 1 GWEI for every block you held the NFT.

1. Off-chain users need to sign a message that contains their `address`, the `tokenId` and the `heldUntil` block.
2. users need to create a proof using their `leaf` and the `root`
3. user calls `claim` with the signed message, and their proof.
4. Using ECDSA recover, we need to view the address that signed the message, as well as the data in the message.
5. After confirming the signer is the owner of the `tokenId` in the message data, we need to confirm their `proof` is valid.

## Claim function

Claim()

- `proof`
- `id`

## Additional files/scripts needed

1. `createLeaves` script to search contract from blockStart to blockEnd
2. `viewHeldUntil` script that allows users to view the block they held their NFT until
3. `createSignature` script to allow users to create a `signature`, which is required to claim

## Left off

9/8 notes:

1. I just set up the ECDSA recover logic, now need to create the leaf in solidity using the input (so user doesn't have to provide leaf)
2. Now that you have the leaf, call verify and ensure that the proof is valid
3. reward calculation time

I've set up the logic discussed above, now it is time to test that it works:

1. deploy the mock NFT contract on anvil
2. deploy the Claim contract on anvil
3. create a Reward Event with `createRewardEvent()` function
4. call `claimWithSignature()` in claim contract

After ensuring this flow works, I can then modify the `Claim` contract logic

- possibly add a new `claim()` function that uses msg.sender as opposed to signature recover

9/10 notes:

1. Add conditional inside `createRewardEvent()` to ensure the `organizer`/`msg.sender` has provided the funds required for the rewardEvent

VR will only prevail if they continiously showcase exclusive options and experiences that traditional format simply cannot provide.

2. For the signature passed to the `claimWithSignature` function, we are trying to allow users to `claim` from another account that isn't their main, while also having the rewards sent directly to whatever address they want.

Left off setting up the `claimWithSignature()` test

9/12 notes:

The test was passing on 9/10, now its time to revise the smart contract before cleaning up all the scripts and throwing it together inside a frontend

Thoughts for the future; how will RPC URL work? will we use a public one? or will users provide an api key and then use their own?

TO DO:

1.  clean up contract
    - possibly add events later
    - should I add `remainingRewards` variable to the `RewardEvent` struct?
2.  clean up scripts

    This is going to be a massive piece of the project - need to make all the scripts use input as opposed to hard-coded examples - need to create new scripts for features we currently lack

         1. `createLeaves` script to search contract from blockStart to blockEnd
            - block start record initial leafData excluding `heldUntil`
            - search through the block duration for `Transfer` events
                - record `heldUntil` for the `tokenId`s that were transferred
            - finally for all leaves that still contain a `0` value for `heldUntil`, set it to the `blockEnd`
         3. `viewHeldUntil` script that allows users to view the block they held their NFT until
            - takes  nftAddress, `tokenId`, `blockStart`, and a `blockEnd`
            - starting at `blockStart`, loop through duration to see if the `Transfer` event was fired for that specific `tokenId`
            - again, if still `0` at the end of the loop, set the `heldUntil` value to the `blockEnd` value
         4. `createSignature` script to allow users to create a `signature`, which is required to claim
            - this is kinda done, still hard-coded values though
            -

3.  add frontend
4.  connect the pieces

Checklist:

1. cleaned her up nicely
   - still need to add events
   - might add `remainingRewards` variable
2. cleaned up partially

   - `createSig`
   - `createMerkle`

Left off notes:

On the front end eth_signTypedData_v4 from metamask will be needed to sign using private key
https://docs.metamask.io/wallet/how-to/sign-data/#use-eth_signtypeddata_v4

For user's sake, should we have a script that creates the reward event, leaves, and merkle tree in one? I think so
Input needed:
(`RewardEvent` params minus `merkleRoot`)

1. `nftAddress`
2. `blockStart`
3. `blockEnd`
4. `rewardAmount`
5. `nfts`
6. `organizer`
7. `rewardToken`

User flow:

1. create reward event form on frontend

Under the hood:

1. form calls `createLeaves` using input
2. that calls `createMerkle`
3. which in turn calls `createRewardEvent` on the `Claim.sol` contract

## Newest data

nft contract sepolia:

merkle root: 0xebd0338c2091ebb3e5aaab17c9c880689563fe74580addc55a1291d0abad6199

leaves: at top of js/createMerkle.js and bottom of js/createLeaves.js

proof: Value: [
'0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E',
'0x52469E13ac6DdbFbf803F48E7106f8294E2B888f',
'0',
'4283030'
]
Proof: [
'0x1a2ebc620fac4381f362fbbbc78d804f51d5dbd8f2da853a45ac070b2ed7be4a',
'0xe7cbbcb750ea571b385ae7d5a7b297734d0a666be991078b26d7c763ac1a04d1',
'0x633c0c6915fcdb2ef3df589771dba71b13add953936783a02d6ba820b1028a20'
]
Value: [
'0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E',
'0x52469E13ac6DdbFbf803F48E7106f8294E2B888f',
'1',
'4283024'
]
Proof: [
'0x6230c7deeba2e154b2c8504a9c2f623ca737cfebebcfb7ff662e46382bee5541',
'0x2a8fbac61582387db781b04ab95494ef0c10fa2f463a24c7bfcf8a1532da2f2d'
]
Value: [
'0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E',
'0x52469E13ac6DdbFbf803F48E7106f8294E2B888f',
'2',
'4283030'
]
Proof: [
'0x56cf7fd6c858777a9a0dfb29f4bc0a5724296f05470a2f2577e3c38ca88f8964',
'0xe7cbbcb750ea571b385ae7d5a7b297734d0a666be991078b26d7c763ac1a04d1',
'0x633c0c6915fcdb2ef3df589771dba71b13add953936783a02d6ba820b1028a20'
]
Value: [
'0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E',
'0x52469E13ac6DdbFbf803F48E7106f8294E2B888f',
'3',
'4283030'
]
Proof: [
'0xfada35f7aff8960dc13a6b73c8d8c02718eb405666d9c3ffb0a4fa46b3067889',
'0x633c0c6915fcdb2ef3df589771dba71b13add953936783a02d6ba820b1028a20'
]
Value: [
'0xe4A98D2bFD66Ce08128FdFFFC9070662E489a28E',
'0x52469E13ac6DdbFbf803F48E7106f8294E2B888f',
'4',
'4283030'
]
Proof: [
'0x9353681c443b2f04714e33f4bfe53486dfb24049710d211ba5a6d1d91780aa43',
'0x2a8fbac61582387db781b04ab95494ef0c10fa2f463a24c7bfcf8a1532da2f2d'
]

## Timeline notes

9/13 notes:

1. revise scripts to take input and then craete any additionally needed scripts

Different flows discovered:

NEED TO CREATE EVENT FIRST BECAUSE EVENTID IS A KEY ELEMENT OF THE LEAVES, DOES THIS MEAN OUR SYSTEM REQUIRES ORGANIZER TO MAKE TWO SEPERATE TX?

You could argue that two seperate tx are inherit if you look at the protocol from this perspective:

1. organizers publicly announce event and create `RewardEvent` on `Claim.sol`
2. once reward period has ended, they update the event to include the `merkleRoot`
3. users may now claim rewards

Alt perspective:

1. organizers publicly announce event
2. once reward period has ended the organizer creates the `RewardEvent`
3. organizer creates `merkleRoot` and passes it to the event
4. users may now claim rewards

**SOLUTION** `eventId` won't be based upon the `eventMap` length but instead upon the `organizer`'s specific eventId

wait but lets rethink the leaf structure:
Need a `nftAddress`, `tokenId`, `heldUntil`

If event A uses 0x7, 7, and 7 as input

and event B uses 0x7, 7, and 7, the input is the same, could this cause issues?

other users can't steal the funds since we have `msg.sender` checks, any other issues present?

Alright redesign the `leaf` structure to only include the barebones three variables listed above

## IDEA for new project:

reward event for stack exchange ethereum users

This would read from stack exchange api to view user data such as rep and description
to match eth address to stack exchange account, users will need to put their address in stack exchange desc

9/14 notes:

1. assess current project status
   -
