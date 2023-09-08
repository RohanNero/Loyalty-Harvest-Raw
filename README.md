## Foundry Merkle

The goal of this project is to allow anyone to create a `reward event` for **any** ERC-721 token, in which any address that holds the NFT during the period will receive rewards.

Incentivizes users to hold NFTs that they currently own, and other users to buy an NFT if they don't hold one.

### Tech

Under the hood this project consists of a few different pieces:

1. an ERC-721 contract
2. a claim contract
   - contains a merkle root
   - ECDSA recover
   - and some amount of ETH or token to send to holders as reward
3. off-chain script to create the **Merkle tree**
4. off-chain script that allows user's to create a `proof` using their `leaf` and the `root`
