import { ethers } from "ethers";
import { useEffect, useState } from "react";

const LPPoolCard = () => {
  const [LPTokenName, setLPTokenName] = useState("");
  const [LPTokenAmount, setLPTokenAmount] = useState();
  const [PairAddress, setPairAddress] = useState();

  const [userLpTokenValue, setUserLpTokenValue] = useState();
  const [totalLpTokenAmount, setTotalLpTokenAmount] = useState();
  const [usdtAddress, setUsdtAddress] = useState();
  const [usdtAmountInLpContract, setUsdtAmountInLpContract] = useState();

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

        //사용자가 보유한 LP 토큰 개수
        const token_url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${pairAddress}&address=${testAccount}&tag=latest&apikey=${etherscanKey}`;
        const token_response = await fetch(token_url);
        const token = await token_response.json();
        setLPTokenAmount(Number(ethers.formatEther(token.result)));

        //LP Contract의 심볼 불러오기
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

        // 아래 추가된 부분은 사용자가 보유한 LP 토큰의 달러 가치 계산하기

        //1. LP Contract에 있는 전체 USDT 개수 구하기 (LP의 TVL = 2 * 전체 USDT 개수)
        const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
        setUsdtAddress(usdtAddress);
        const usdt_url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${usdtAddress}&address=${pairAddress}&tag=latest&apikey=${etherscanKey}`;
        const usdt_response = await fetch(usdt_url);
        console.log(usdt_url);
        const usdt = await usdt_response.json();
        setUsdtAmountInLpContract(Number(usdt.result) / 10 ** 6);

        //2. LP Contract에서 발행된 전체 LP 토큰 개수
        const totalLpTokenSupply_url = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${pairAddress}&apikey=${etherscanKey}`;
        const totalLpTokenSupply_response = await fetch(totalLpTokenSupply_url);
        const totalLpTokenSupply = await totalLpTokenSupply_response.json();
        setTotalLpTokenAmount(
          Number(ethers.formatEther(totalLpTokenSupply.result))
        );

        //2. 사용자가 보유한 LP 토큰 개수가 가진 달러 가치 (TVL / 전체 LP 개수) * 사용자가 보유한 LP 개수
        // LP 토큰 1개 가격 = (TVL / 전체 LP 개수)
        setUserLpTokenValue(
          LPTokenAmount * ((2 * usdtAmountInLpContract) / totalLpTokenAmount)
        );
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
          <div>{Number(userLpTokenValue).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default LPPoolCard;
