pragma solidity ^0.5.0;

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import './Verifier.sol';
import './ERC721Mintable.sol';

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is HFCCR {
    Verifier verifier;
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 id;
        address account;
    }
    // TODO define an array of the above struct
    Solution[] solutionList;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private solutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(address account);

    modifier onlyValidSolution(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) {
        require(
            verifier.verifyTx(a, b, c, input),
            "SolnSquareVerifier: Solution has invalid proof"
        );
        _;
    }

    constructor (address verifierAddress) public {
        verifier = Verifier(verifierAddress);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address account, uint256 id, bytes32 solutionKey) internal {
        require(account != address(0), "SolnSquareVerifier: Invalid address");
        solutions[solutionKey] = Solution({id: id, account: account});
        solutionList.push(solutions[solutionKey]);
        emit SolutionAdded(account);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNewNFT(
        address account,
        uint256 id,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    )
        public
        onlyValidSolution(a, b, c, input)
        returns(bool)
    {
        bytes32 solutionKey = getSolutionKey(a, b, c, input);
        require(
            solutions[solutionKey].account == address(0),
            "SolnSquareVerifier: duplicate solution"
        );
        addSolution(account, id, solutionKey);
        return mint(account, id, "");
    }

    function getSolutionKey(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    )
        internal
        pure
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(a, b, c, input));
    }
}