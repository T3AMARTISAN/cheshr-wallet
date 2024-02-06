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
        // WETH-USDT Pair LP Token Contract
        // CA: 0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852
        const pairAddress = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852";
        setPairAddress(pairAddress);

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

        ///////////////////////////////////////////////////////////////////////////////////////////

        /* 
        ####사용자가 보유한 LP 토큰의 달러 가치 계산하기####
        : LP CA 주소를 인풋으로 받아서 사용자 보유 LP 토큰 달러 가치 반환하는 함수

          - https://v2.info.uniswap.org/pairs 유니스왑 v2 상위 페어  
          - 0. ###lp CA는 사용자가 입력하게 둔다고 가정###
        */

        /* 1. lp CA를 받아서 두 페어 파악: lp CA의 token0, token1 함수 활용
         */

        /* 2. 두 토큰 페어의 유형 파악: token0과 token1 중에 스테이블코인 있는지, ETH 있는지, 스테이블코인과 ETH 둘 다 없는지 세 경우로 나뉨
          -###usdt 등 유명 토큰의 ca 저장한 json 파일 필요
          -usdt, usdc, dai, fei, eth(WETH ca) 주소 미리 저장해놓고, 
          -비교해서 유형 파악해서 분류 (분류 후 if 문으로 각각의 아래 함수 호출)
        */

        /*3. token0 이나 token1 중 하나가 스테이블코인(usdt, usdc, dai, fei 등) 인 경우 lp 토큰 달러 가치 반환 함수
          -tokenA를 스테이블코인 페어로 지정하고, tokenB를 그외 페어로 지정
          -tokenA의 잔고 파악해 Lp CA 의 TVL 계산 (lp CA의 getReserves() 하면 두 페어의 잔고 나옴 -> 굳이 해당 토큰 ca 안 가도 이 컨에서 잔고 확인 가능)
          -Total LpSupply 계산
          -사용자의 LpAmount 계산
          - 위의 값으로 LP 토큰의 달러 가치 계산        
        */

        /*4. token0과 token1 모두 스테이블코인이 아닐 때 lp 토큰 달러 가치 반환 함수 : 둘 중 하나가 ETH인 경우
          -tokenA를 ETH로 지정, tokenB를 나머지 페어로 지정
          -tokenA의 잔고 파악 (lp CA의 getReserves() 하면 두 페어의 잔고 나옴 -> 굳이 해당 토큰 ca 안 가도 이 컨에서 잔고 확인 가능)
          -tokenA의 시세 DEX에서 가져오기(twap 활용한 24시간 평균 가격?: // https://soliditydeveloper.com/uniswap-oracle ca에서 시간가중평균 가격 가져오기 관련)
          -tokenA의 잔고와 시세로 Lp CA의 TVL 계산
          -Total LpSupply 계산
          -사용자늬 LpAmount 계산
          -위의 값으로 Lp 토큰 달러 가치 계산
        */

        /*5. token0과 token1 모두 스테이블코인도 아니고 ETH도 아닌 경우: uniswap v2 pool 상위 100위권에는 없어서 일단 보류
         */

        /*에러 발생 우려 있는 부분(조사 필요): useEffect 와 async 함수. 
        getTokens() 안에 모든 걸 넣어야 할지,
        각각의 함수로 분류한 후 연이어 호출하게 할지, (이 경우 useEffect 어떻게 구성해야 잘 작동할지)
        */

        ///////////////////////////////////////////////////////////////////////////////////////////
        /*
          아래는 그 전에 WETH-USDT 페어로 LP 토큰의 달러 가치 계산했던 기존 코드
        */

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
