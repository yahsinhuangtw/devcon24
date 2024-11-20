//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/NFT.sol";
import "./DeployHelpers.s.sol";

contract DeployYourContract is ScaffoldETHDeploy {
  // use `deployer` from `ScaffoldETHDeploy`
  function run() external ScaffoldEthDeployerRunner {
    NFT nft = new NFT(deployer);
    console.logString(
      string.concat(
        "NFT deployed at: ", vm.toString(address(nft))
      )
    );
  }
}
