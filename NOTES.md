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

## Question

What if a contest allowed any address to claim the reward as long as they had the proof created by a leaf and the root, but then the transaction failed to out of gas, would a bot be able to pick this transaction up and steal the funds by copying the input?

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
