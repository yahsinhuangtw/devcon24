
'use client';
import { useEffect, useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

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
        </div>
    );
};

export default MintNFT;