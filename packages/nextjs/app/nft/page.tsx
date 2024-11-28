
'use client';
import { useEffect, useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract, useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";
import { useWriteContracts } from 'wagmi/experimental'

// Get Max Supply for the NFT Collection
// The first step involves using the useScaffoldReadContract hook to read data from your smart contract. 
// The code snippet retrieves the maximum supply of NFTs allowed in the collection
const MintNFT = () => {
    const { data: supply } = useScaffoldReadContract({
        contractName: "NFT",
        functionName: "maxSupply",
    });

    // Get Current Token ID
    const { data: tokenID } = useScaffoldReadContract({
        contractName: "NFT",
        functionName: "_nextTokenId",
    });

    const [remaining, setRemaining] = useState<number | null>(null);
    useEffect(() => {
        if (supply !== undefined) {
            setRemaining(Number(supply) - (tokenID ? Number(tokenID) : 0));
        }
    }, [tokenID, supply]);

    const { writeContractAsync: writeScaffoldContractAsync } = useScaffoldWriteContract("NFT");
    const { address: connectedAddress } = useAccount();

    // wagmi hook to batch write to multiple contracts (EIP-5792 specific)
    const { writeContractsAsync } = useWriteContracts();
    // add this later to read address and contract abi
    const { data: NFT } = useDeployedContractInfo("NFT");

    return (
        <div>
            <button
                className="btn btn-primary"
                onClick={async () => {
                    try {
                        await writeScaffoldContractAsync({
                            functionName: "safeMint",
                            args: [connectedAddress],
                        });
                    } catch (e) {
                        console.error("Error minting NFT:", e);
                    }
                }}
            >
                Mint NFT
            </button>
            <button
                className="btn btn-primary w-45"
                onClick={async () => {
                    try {
                        if (!NFT) return;
                        // TODO: update the ENV
                        const paymasterURL = process.env.NEXT_PUBLIC_PAYMASTER_URL;
                        await writeContractsAsync({
                            contracts: [
                                {
                                    address: NFT.address,
                                    abi: NFT.abi,
                                    functionName: "safeMint",
                                    args: [connectedAddress],
                                },
                            ],
                            capabilities: {
                                paymasterService: {
                                    url: paymasterURL,
                                },
                            },
                        });
                        notification.success("NFT minted");
                    } catch (e) {
                        console.error("Error minting NFT:", e);
                    }
                }}
            >
                Gasless Mint
            </button>
        </div>
    );
};

export default MintNFT;