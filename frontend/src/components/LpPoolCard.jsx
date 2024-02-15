import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  USDT_CONTRACT,
  USDC_CONTRACT,
  DAI_CONTRACT,
  WETH_CONTRACT,
} from "../tokenContracts/contractAddress.js";
import { useOutletContext } from "react-router-dom";

//test lp CA와 지갑은 현재 useEffect 인풋값으로 들어감.

const LPPoolCard = ({ _lpContractAddress, _lpAbi, _pairname }) => {
  const { currentProvider, setCurrentAccount, currentAccount } =
    useOutletContext();

  const [lpContract, setLpContract] = useState();
  const [LPTokenName, setLPTokenName] = useState("");
  const [LPTokenAmount, setLPTokenAmount] = useState();
  const [tokens, setTokens] = useState([]);
  const [primaryToken, setPrimaryToken] = useState([]);
  const [tvl, setTvl] = useState();
  const [userLpValue, setUserLpValue] = useState();
  const [totalLpSupply, setTotalLpSupply] = useState();

  //하나의 LP 컨트랙트 주소를 받았을 때 lpCard의 contract 객체 설정
  const setLpCA = async () => {
    try {
      if (!currentProvider) return;
      const contract = new ethers.Contract(
        _lpContractAddress,
        _lpAbi,
        currentProvider
      );
      setLpContract(contract);
    } catch (error) {
      console.log(error);
    }
  };

  //lP 토큰의 이름 불러오기
  const getLpName = async () => {
    try {
      if (!lpContract) return;
      const contract_symbol = await lpContract.symbol();
      setLPTokenName(contract_symbol);
    } catch (error) {
      console.log(error);
    }
  };

  //사용자가 보유한 LP 토큰 수
  const getUserLpAmount = async () => {
    try {
      if (!lpContract || !currentAccount) return;

      var userLpAmount = await lpContract.balanceOf(currentAccount);
      userLpAmount = Number(userLpAmount);
      setLPTokenAmount(userLpAmount);
    } catch (error) {
      console.log(error);
    }
  };

  //전체 발행 LP 토큰 수
  const getTotalLpSupply = async () => {
    try {
      var totalLpSupply = await lpContract.totalSupply();
      var totalLpSupply = Number(totalLpSupply);
      setTotalLpSupply(totalLpSupply);
    } catch (error) {
      console.log(error);
    }
  };

  //스테이블코인이나 eth 처럼 tvl 계산에 사용할 primary token을 두 페어 중 앞에 배열해 구별해서 사용할 수 있도록 분류
  const sortLpPairType = async () => {
    try {
      if (!lpContract) return;

      //lp Contract의 token0, token1이 어떤 토큰인지 저장
      var token0 = await lpContract.token0();
      token0 = token0.toLowerCase();
      var token1 = await lpContract.token1();
      token1 = token1.toLowerCase();
      setTokens([token0, token1]);

      //시세를 계산해 tvl 계산에 사용할 primary token을 usdt, usdc, dai, weth 중에서 정함

      if (token0 == USDT_CONTRACT || token1 == USDT_CONTRACT) {
        //USDT는 바이낸스에서 시세 가져오는 게 아니라 usdt = 1 usdt 이기 때문에 우선적으로 페어에 usdt 있는 경우 usdt를 primary token[0]으로 지정

        if (token0 == USDT_CONTRACT) {
          //usdt가 첫 번째 페어인 경우
          setPrimaryToken(token0);
        } else {
          //usdt가 두 번째 페어인 경우
          setPrimaryToken(token1);
        }
      } else if (
        //USDC, DAI 있는 경우 이를 primary token으로 지정
        token0 == USDC_CONTRACT ||
        token0 == DAI_CONTRACT ||
        token1 == USDC_CONTRACT ||
        token1 == DAI_CONTRACT
      ) {
        if (token0 == USDC_CONTRACT || token0 == DAI_CONTRACT) {
          //usdc, dai가 첫 번째 페어인 경우
          setPrimaryToken(token0);
        } else {
          //usdc, dai가 두 번째 페어인 경우
          setPrimaryToken(token1);
        }
      } else {
        //나머지 경우는 다 WETH가 primary token

        if (token0 == WETH_CONTRACT) {
          //weth가 첫 번째 페어인 경우
          setPrimaryToken(token0);
        } else if (token1 == WETH_CONTRACT) {
          //weth가 두 번째 페어인 경우
          setPrimaryToken(token1);
        } else {
          //혹시나 weth이 없는 lp 페어의 경우 지금은 에러 처리
          console.log("error");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //LP 풀의 TVL 구하기: primary token에 따라 구분하여 바이낸스 api 시세 활용해 TVL 구함
  const getTvl = async () => {
    try {
      if (primaryToken.length == 0) return;
      if (LPTokenAmount == 0) return;

      if (primaryToken == USDT_CONTRACT) {
        //primary token이 USDT인 경우

        //token0과 token1 중 어떤 게 스테이블코인인지 파악해서 tvl 계산
        if (tokens[0] == primaryToken) {
          //token0 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var usdtReserve = Number(reserve[0]);
          usdtReserve = usdtReserve / 10 ** 6; //decimal
          setTvl(usdtReserve * 2);
        } else {
          //token1 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var usdtReserve = Number(reserve[1]);
          usdtReserve = usdtReserve / 10 ** 6; //decimal
          setTvl(usdtReserve * 2);
        }
      } else if (primaryToken == USDC_CONTRACT) {
        //primary token이 USDC인 경우

        //USDC-USDT 페어 시세 바이낸스에서 가져오기
        var response = await axios.get(
          "https://api.binance.com/api/v3/ticker/price"
        );
        var usdcUsdt = response.data[422].price;

        if (tokens[0] == primaryToken) {
          //token0 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var usdcReserve = Number(reserve[0]);
          usdcReserve = usdcReserve / 10 ** 6; //decimal
          setTvl(usdcUsdt * usdcReserve * 2);
        } else {
          //token1 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var usdcReserve = Number(reserve[1]);
          usdcReserve = usdcReserve / 10 ** 6; //decimal
          setTvl(usdcUsdt * usdcReserve * 2);
        }
      } else if (primaryToken == DAI_CONTRACT) {
        //primary token이 DAI 경우

        //DAI-USDT 페어 시세 바이낸스에서 가져오기
        var response = await axios.get(
          "https://api.binance.com/api/v3/ticker/price"
        );
        var daiUsdt = response.data[873].price;

        if (tokens[0] == primaryToken) {
          //token0 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var daiReserve = Number(reserve[0]);
          daiReserve = daiReserve / 10 ** 18; //decimal
          setTvl(daiUsdt * daiReserve * 2);
        } else {
          //token1 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var daiReserve = Number(reserve[1]);
          daiReserve = daiReserve / 10 ** 18;
          setTvl(daiUsdt * daiReserve * 2);
        }
      } else if (primaryToken == WETH_CONTRACT) {
        //primary token이 WETH인 경우

        //ETH-USDT 페어 시세 바이낸스에서 가져오기
        var response = await axios.get(
          "https://api.binance.com/api/v3/ticker/price"
        );
        var ethUsdt = response.data[12].price;

        if (tokens[0] == primaryToken) {
          //token0 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var ethReserve = Number(reserve[0]);
          ethReserve = ethReserve / 10 ** 18; //decimal
          setTvl(ethUsdt * ethReserve * 2);
        } else {
          //token1 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var ethReserve = Number(reserve[1]);
          ethReserve = ethReserve / 10 ** 18; //decimal
          setTvl(ethUsdt * ethReserve * 2);
        }
      } else {
        //혹여나 걸러지지 않은 에러의 경우
        console.log("getTvl error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //최종적으로 사용자가 보유한 LP 토큰의 달러 가치 구하기
  const getLpValue = async () => {
    try {
      if (!tvl || !LPTokenAmount || !totalLpSupply) return;
      var userLpValue = tvl * (LPTokenAmount / totalLpSupply);
      userLpValue = Number(userLpValue);
      userLpValue = userLpValue.toFixed(10); //소수점 자리수
      setUserLpValue(userLpValue);
    } catch (error) {
      console.log(error);
    }
  };

  //테스트 지갑 주소 하드코딩 부분. 테스트 ->실제 변경 시 유즈이펙트 제거해주면 됨
  useEffect(() => {
    setCurrentAccount(process.env.REACT_APP_TEST_ACCOUNT);
  }, []);
  //pepe-eth 보유 테스트 지갑: "0x805B9Bd203ad2B69A241AE5084abEE11183f9429"
  //공동 test 지갑: process.env.REACT_APP_TEST_ACCOUNT

  useEffect(() => {
    if (!currentProvider) {
      return;
    }
    setLpCA();
    // pepe-eth : 0xa43fe16908251ee70ef74718545e4fe6c5ccec9f
    // weth-usdt: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"
  }, [currentProvider]);

  useEffect(() => {
    if (!lpContract) {
      return;
    }
    getLpName();
  }, [lpContract]);

  useEffect(() => {
    if (!lpContract || !currentAccount) {
      return;
    }
    getUserLpAmount();
  }, [lpContract, currentAccount]);

  useEffect(() => {
    if (!lpContract) {
      return;
    }
    getTotalLpSupply();
  }, [lpContract]);

  useEffect(() => {
    if (!lpContract) {
      return;
    }
    sortLpPairType();
  }, [lpContract]);

  useEffect(() => {
    if (primaryToken.length == 0 || !lpContract || LPTokenAmount == 0) {
      return;
    }
    getTvl();
  }, [primaryToken, lpContract]);

  useEffect(() => {
    if (!tvl || !LPTokenAmount || !totalLpSupply) {
      return;
    }
    getLpValue();
  }, [tvl, LPTokenAmount, totalLpSupply]);

  return (
    <>
      {userLpValue ? (
        <div className="bg-neutral-400 rounded-lg w-11/12 h-fit pb-10 my-10 flex flex-col">
          <div className="flex flex-row justify-between m-4">
            <div>UNISWAP V2 POOL</div>
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
              <div>
                {LPTokenName} : {_pairname}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>Amount</div>
              <div>{(LPTokenAmount / 10 ** 18).toFixed(12)}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div>USDT</div>
              <div>{userLpValue}</div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default LPPoolCard;
