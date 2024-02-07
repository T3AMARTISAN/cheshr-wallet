import { ethers } from "ethers";
import { useEffect, useState } from "react";

import {
  USDT_CONTRACT,
  USDC_CONTRACT,
  DAI_CONTRACT,
  WETH_CONTRACT,
} from "../tokenContracts/contractAddress.js";
import { useOutletContext } from "react-router-dom";

//test lp CA와 지갑은 현재 useEffect 인풋값으로 들어감.

const LPPoolCard = () => {
  const { currentProvider } = useOutletContext();

  const [lpContractAddress, setLpContractAddress] = useState();
  const [lpContract, setLpContract] = useState();
  const [LPTokenName, setLPTokenName] = useState("");
  const [LPTokenAmount, setLPTokenAmount] = useState();
  const [tokens, setTokens] = useState([]);
  // const [primarytokens, setPrimaryTokens] = useState([]);
  const [tvl, setTvl] = useState();
  const [userLpValue, setUserLpValue] = useState();

  //하나의 LP 컨트랙트 주소를 받았을 때 이더스캔api로 abi 불러와 이 lpCard의 contract 객체 설정
  const setLpCA = async (_lpCa) => {
    setLpContractAddress(_lpCa);
    const contract_url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${_lpCa}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
    const contract_response = await fetch(contract_url);
    const { result } = await contract_response.json();
    const contract_abi = result[0].ABI;
    const contract = new ethers.Contract(_lpCa, contract_abi, currentProvider);
    setLpContract(contract);
  };

  //lP 토큰의 이름 불러오기
  const getLpName = async () => {
    const contract_symbol = await lpContract.symbol();
    setLPTokenName(contract_symbol);
  };

  const getUserLpAmount = async (_address) => {
    var userLpAmount = await lpContract.balanceOf(_address);
    userLpAmount = Number(userLpAmount);
    setLPTokenAmount(userLpAmount);
  };

  //스테이블코인이나 eth 처럼 tvl 계산에 사용할 primary token을 두 페어 중 앞에 배열해 구별해서 사용할 수 있도록 분류
  // const sortLpPairType = async () => {
  //   var token0 = await lpContract.token0();
  //   token0 = token0.toLowerCase();
  //   var token1 = await lpContract.token1();
  //   token1 = token1.toLowerCase();
  //   setTokens([token0, token1]);

  //   const stableCoinArray = [
  //     USDT_CONTRACT,
  //     USDC_CONTRACT,
  //     DAI_CONTRACT,
  //     WETH_CONTRACT,
  //   ];
  //   var count = 0;

  //   stableCoinArray.map((v, i) => {
  //     if (token0 == v) {
  //       setPrimaryTokens([token0, token1]);
  //       count++;
  //     } else if (token1 == v) {
  //       setPrimaryTokens([token1, token0]);
  //       count++;
  //     }
  //   });
  // };

  //LP 풀의 TVL 구하기 : 여기서 스테이블코인인지, 이더풀인지에 따라 구분하여 TVL 구함
  const getTvl = async () => {
    //스테이블코인이 primary token인 경우
    // if (primarytokens[0] !== WETH_CONTRACT) {
    //   //token0과 token1 중 어떤 게 스테이블코인인지 파악해서 tvl 계산
    //   if (tokens == primarytokens) {
    //     const reserve = await lpContract.getReserves();
    //     const dollars = Number(reserve[0]);

    //     setTvl(dollars * 2);
    //   } else {
    //     const reserve = await lpContract.getReserves();
    //     const dollars = Number(reserve[1]);

    //     setTvl(dollars * 2);
    //   }
    // } else {
    //eth가 primary token인 경우
    //ETH 시세 구하기
    var token0Value = await lpContract.price0CumulativeLast();
    // var token0Decimals = await lpContract.
    token0Value = Number(token0Value);
    var normalizedToken0Value = token0Value / 10 ** 18;

    var token1Value = await lpContract.price1CumulativeLast();
    token1Value = Number(token1Value);
    var normalizedToken1Value = token1Value / 10 ** 18;

    const reserve = await lpContract.getReserves();
    const token0Amount = Number(reserve[0]);
    const token1Amount = Number(reserve[1]);

    console.log(1, token0Value);
    console.log(2, token1Value);
    console.log(3, token0Value / normalizedToken1Value);
    // https://medium.com/@epheph/using-uniswap-v2-oracle-with-storage-proofs-3530e699e1d3
    // https://uniswap.org/whitepaper.pdf

    // everything in token1(usdt) tvl: reserve0 * price1CumulativeLast + reserve1??
    //reserve0 * price1CumulativeLast: We're essentially converting the amount of token0 in the pool to its equivalent value in terms of token1.

    setTvl(token0Value * token0Amount * 2);

    // //token0 과 token1 중 어떤 게 이더인지 파악해서 tvl 계산
    // if (tokens == primarytokens) {
    //   const reserve = await lpContract.getReserves();
    //   const ethAmount = Number(reserve[0]);

    //   setTvl(ethValue * ethAmount * 2);
    // } else {
    //   const reserve = await lpContract.getReserves();
    //   const ethAmount = Number(reserve[1]);

    //   setTvl(ethValue * ethAmount * 2);
    // }
    // }
  };

  //최종적으로 사용자가 보유한 LP 토큰의 달러 가치 구하는 함수
  const getLpValue = async (_address) => {
    var lpSupply = await lpContract.totalSupply();
    var lpSupply = Number(lpSupply);

    var userLpValue = (tvl * LPTokenAmount) / lpSupply;
    userLpValue = userLpValue / 10 ** 6;
    userLpValue = userLpValue.toFixed(2);

    setUserLpValue(userLpValue);
  };

  useEffect(() => {
    if (!currentProvider) {
      return;
    }
    setLpCA("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852");
  }, [currentProvider]);

  // useEffect(() => {
  //   if (!lpContract) {
  //     return;
  //   }
  //   sortLpPairType();
  // }, [lpContract]);

  useEffect(() => {
    if (!lpContract) {
      return;
    }
    getLpName();
  }, [lpContract]);

  useEffect(() => {
    if (!lpContract) {
      return;
    }
    getUserLpAmount(process.env.REACT_APP_TEST_ACCOUNT);
  }, [lpContract]);

  useEffect(() => {
    if (!lpContract) {
      return;
    }
    getTvl();
  }, [lpContract]);

  useEffect(() => {
    if (!tvl || !LPTokenAmount) {
      return;
    }
    getLpValue(process.env.REACT_APP_TEST_ACCOUNT);
  }, [tvl, LPTokenAmount]);

  return (
    <div className="bg-neutral-400 rounded-lg w-11/12 h-fit pb-10 my-10 flex flex-col">
      <div className="flex flex-row justify-between m-4">
        <div>UNISWAP POOL</div>
        {/* <a
          href={`https://etherscan.io/address/${PairAddress}`}
          className="font-light text-xs"
        >
          See Etherscan
        </a> */}
      </div>
      <div className="flex flex-row justify-between mx-4 text-neutral-50">
        <div className="flex flex-col justify-center gap-2">
          <div>PROVIDED</div>
          <div>{LPTokenName}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div>Amount</div>
          <div>{(LPTokenAmount / 10 ** 18).toFixed(8)}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div>USD</div>
          <div>{userLpValue}</div>
        </div>
      </div>
    </div>
  );
};

export default LPPoolCard;
