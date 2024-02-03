import { ethers } from "ethers";
import { useEffect, useState } from "react";

const LPTokens = () => {
  const [LPTokenName, setLPTokenName] = useState("");
  const [LPTokenAmount, setLPTokenAmount] = useState();
  const [PairAddress, setPairAddress] = useState();

  useEffect(() => {
    async function getLPTokens() {
      try {
        const etherscanKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
        const infuraKey = process.env.INFURA_API_KEY;
        const testAccount = process.env.REACT_APP_TEST_ACCOUNT;
        const pairAddress = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852";
        setPairAddress(pairAddress);

        // WETH-USDT Pair LP Token Contract
        // CA: 0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852
        const token_url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${pairAddress}&address=${testAccount}&tag=latest&apikey=${etherscanKey}`;
        const token_response = await fetch(token_url);
        const token = await token_response.json();
        setLPTokenAmount(ethers.formatEther(token.result));

        const contract_url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${pairAddress}&apikey=${etherscanKey}`;
        const contract_response = await fetch(contract_url);
        const { result } = await contract_response.json();
        const contract_abi = result[0].ABI;

        const provider = new ethers.InfuraProvider("mainnet", infuraKey);
        const contract = new ethers.Contract(
          pairAddress,
          contract_abi,
          provider
        );
        const contract_symbol = await contract.symbol();
        setLPTokenName(contract_symbol);
      } catch (error) {
        console.log(error);
      }
    }

    getLPTokens();
  });

  return (
    <div className="bg-neutral-400 rounded-lg w-11/12 h-fit pb-10 my-10 flex flex-col">
      <div className="flex flex-row justify-between m-4">
        <div>UNISWAP POOL</div>
        <a
          href={`https://etherscan.io/address/${PairAddress}`}
          className="font-light text-xs"
        >
          See Etherscan
        </a>
      </div>
      <div className="flex flex-row justify-between mx-4 text-neutral-50">
        <div className="flex flex-col justify-center gap-2">
          <div>PROVIDED</div>
          <div>{LPTokenName}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div>Amount</div>
          <div>{LPTokenAmount}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div>USD</div>
          <div>$TBD</div>
        </div>
      </div>
    </div>
  );
};

export default LPTokens;
