const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require('Verifier');
const fs = require('fs');
const path = require('path');

contract('TestSolnSquareVerifier', accounts => {
  describe('can add solution and mint contract', () => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const proofPath = path.join(
      path.dirname(path.dirname(__dirname)),
      'zokrates',
      'code',
      'square',
      'proof.json'
    );
    const zocratesProof = JSON.parse(fs.readFileSync(proofPath).toString());
    const { proof, inputs } = zocratesProof;
    const { a, b, c } = proof;
    let verifier;
    let solnSquareVerifier;

    beforeEach(async () => {
      verifier = await Verifier.new({ from: account_one });
      solnSquareVerifier = await SolnSquareVerifier.new(verifier.address, {
        from: account_one
      });
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('can add a new solution', async () => {
      let added = await solnSquareVerifier.mintNewNFT.call(
        account_two,
        1,
        a,
        b,
        c,
        inputs,
        {from: account_one}
      );
      assert.equal(added, true, 'cannot add solution');
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('can mint ERC721', async () => {
      const minted = await solnSquareVerifier.mint.call(account_three, 99, "", { from: account_one });
      assert.equal(minted, true, 'cannot mint ERC721');
    });
  });
});
