const ERC721MintableComplete = artifacts.require('HFCCR');

contract('TestERC721Mintable', accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  const tokenIdsForAccountOne = [1, 2, 3, 4, 5];
  const tokenIdsForAccountTwo = [11, 12];
  const unminedTokenId = 999;
  const totalTokens =
    tokenIdsForAccountOne.length + tokenIdsForAccountTwo.length;
  const baseTokenURI =
    'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

  describe('match erc721 spec', () => {
    beforeEach(async () => {
      this.contract = await ERC721MintableComplete.new({ from: account_one });

      // TODO: mint multiple tokens
      for (const tokenId of tokenIdsForAccountOne) {
        await this.contract.mint(account_one, tokenId, "", { from: account_one });
      }
      for (const tokenId of tokenIdsForAccountTwo) {
        await this.contract.mint(account_two, tokenId, "", { from: account_one });
      }
    });

    it('should return total supply', async () => {
      const totalSupply = await this.contract.totalSupply.call();
      assert.equal(totalSupply, totalTokens, 'Wrong total supply');
    });

    it('should get token balance', async () => {
      const tokenBalanceForAccountOne = await this.contract.balanceOf.call(
        account_one
      );
      assert.equal(
        tokenBalanceForAccountOne,
        tokenIdsForAccountOne.length,
        'Wrong total balance for account_one'
      );
      const tokenBalanceForAccountTwo = await this.contract.balanceOf.call(
        account_two
      );
      assert.equal(
        tokenBalanceForAccountTwo,
        tokenIdsForAccountTwo.length,
        'Wrong total balance for account_two'
      );
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token uri', async () => {
      const tokenId = tokenIdsForAccountOne[0];
      const correctTokenURI = baseTokenURI + tokenId;
      const tokenURI = await this.contract.tokenURI.call(tokenId, {
        from: account_one
      });
      assert.equal(
        tokenURI,
        correctTokenURI,
        'Token URI is not baseTokenURI + tokenId'
      );
    });

    it('should transfer token from one owner to another', async () => {
      const tokenIdToTransfer = tokenIdsForAccountOne[0];
      await this.contract.transferFrom(
        account_one,
        account_two,
        tokenIdToTransfer,
        { from: account_one }
      );
      const newOwner = await this.contract.ownerOf.call(tokenIdToTransfer);
      assert.equal(
        account_two,
        newOwner,
        'Token transfer does not reflect new owner'
      );
    });
  });

  describe('have ownership properties', () => {
    beforeEach(async function() {
      this.contract = await ERC721MintableComplete.new({ from: account_one });
    });

    it('should fail when minting when address is not contract owner', async () => {
      let failed = false;
      try {
        await this.contract.mint(account_two, unminedTokenId, "", {
          from: account_two
        });
      } catch (e) {
        failed = true;
      }
      assert.equal(failed, true, 'Non owner can mint tokens');
    });

    it('should return contract owner', async () => {
      const isOwner = await this.contract.isOwner.call({ from: account_one });
      assert.equal(isOwner, true, 'accounts[0] is not owner');
    });
  });
});
