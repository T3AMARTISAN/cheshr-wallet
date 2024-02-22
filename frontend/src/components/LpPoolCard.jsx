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

const LPPoolCard = ({
  _lpContractAddress,
  _lpAbi,
  _pairname,
  totalValue,
  setTotalValue,
}) => {
  const { currentProvider, currentAccount } = useOutletContext();

  const [lpContract, setLpContract] = useState();
  const [symbol0, setSymbol0] = useState();
  const [symbol1, setSymbol1] = useState();
  const [LPTokenAmount, setLPTokenAmount] = useState();
  const [tokens, setTokens] = useState([]);
  const [primaryToken, setPrimaryToken] = useState("");
  const [tvl, setTvl] = useState();
  const [userLpValue, setUserLpValue] = useState();
  const [totalLpSupply, setTotalLpSupply] = useState();
  const [reserve0, setReserve0] = useState();
  const [reserve1, setReserve1] = useState();
  const [addedTotal, setAddedTotal] = useState(false);

  //디파이 총합에 더하기
  const addTotal = async () => {
    try {
      if (!userLpValue) return;
      if (addedTotal == false) {
        // console.log("43", typeof userLpValue);
        var total = Number(totalValue) + Number(userLpValue);
        setTotalValue(total);
        console.log("45", total);
        setAddedTotal(true);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

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

      const [name0, name1] = _pairname.split("-");
      setSymbol0(name0);
      setSymbol1(name1);
    } catch (error) {
      console.log(error);
    }
  };

  //사용자가 보유한 LP 토큰 수
  const getUserLpAmount = async () => {
    try {
      if (!lpContract) return;

      var userLpAmount = await lpContract.balanceOf(
        process.env.REACT_APP_TEST_ACCOUNT // 여기를 currentAccount로 바꿔주면 테스트계정 말고 실제 계정으로 작동
      );
      userLpAmount = Number(userLpAmount);

      setLPTokenAmount(userLpAmount);
    } catch (error) {
      console.log(error);
    }
  };

  //전체 발행 LP 토큰 수
  const getTotalLpSupply = async () => {
    try {
      if (LPTokenAmount == 0) return;

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
      if (!lpContract || LPTokenAmount == 0) return;

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

          setReserve0(Number(reserve[0]) / 10 ** 6);
          setReserve1(Number(reserve[1]) / 10 ** 18);
        } else {
          //token1 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var usdtReserve = Number(reserve[1]);
          usdtReserve = usdtReserve / 10 ** 6; //decimal
          setTvl(usdtReserve * 2);

          setReserve0(Number(reserve[0]) / 10 ** 18);
          setReserve1(Number(reserve[1]) / 10 ** 6);
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

          setReserve0(Number(reserve[0]) / 10 ** 6);
          setReserve1(Number(reserve[1]) / 10 ** 18);
        } else {
          //token1 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var usdcReserve = Number(reserve[1]);
          usdcReserve = usdcReserve / 10 ** 6; //decimal
          setTvl(usdcUsdt * usdcReserve * 2);

          setReserve0(Number(reserve[0]) / 10 ** 18);
          setReserve1(Number(reserve[1]) / 10 ** 6);
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

          setReserve0(Number(reserve[0]) / 10 ** 18);
          setReserve1(Number(reserve[1]) / 10 ** 18);
        } else {
          //token1 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var daiReserve = Number(reserve[1]);
          daiReserve = daiReserve / 10 ** 18;
          setTvl(daiUsdt * daiReserve * 2);

          setReserve0(Number(reserve[0]) / 10 ** 18);
          setReserve1(Number(reserve[1]) / 10 ** 18);
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

          setReserve0(Number(reserve[0]) / 10 ** 18);
          setReserve1(Number(reserve[1]) / 10 ** 18);
        } else {
          //token1 이 primaryToken인 경우

          const reserve = await lpContract.getReserves();
          var ethReserve = Number(reserve[1]);
          ethReserve = ethReserve / 10 ** 18; //decimal
          setTvl(ethUsdt * ethReserve * 2);

          setReserve0(Number(reserve[0]) / 10 ** 18);
          setReserve1(Number(reserve[1]) / 10 ** 18);
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
      console.log("new 250", _pairname);
      var userLpValue = tvl * (LPTokenAmount / totalLpSupply);
      userLpValue = Number(userLpValue);
      userLpValue = userLpValue.toFixed(4); //소수점 자리수
      setUserLpValue(userLpValue);

      var amount0 = reserve0 * (LPTokenAmount / totalLpSupply);
      setReserve0(amount0);
      var amount1 = reserve1 * (LPTokenAmount / totalLpSupply);
      setReserve1(amount1);
    } catch (error) {
      console.log(error);
    }
  };

  //일 거래량으로 수익률 보여주기
  // Volume24h * 0.003 * 365 * 100 / TVL
  // const getAPY = async () => {
  //   const response = await axios.get(
  //     "https://api.geckoterminal.com/api/v2/networks/eth/dexes/uniswap_v2/pools"
  //   );
  //   console.log(response);
  //   // var volume24 = response.data;
  // };

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
    getUserLpAmount();
  }, [lpContract]);

  useEffect(() => {
    if (!lpContract || LPTokenAmount == 0) {
      return;
    }
    getTotalLpSupply();
  }, [LPTokenAmount]);

  useEffect(() => {
    if (!lpContract || LPTokenAmount == 0) {
      return;
    }
    sortLpPairType();
  }, [LPTokenAmount]);

  useEffect(() => {
    if (primaryToken.length == 0 || !lpContract || LPTokenAmount == 0) {
      return;
    }
    getTvl();
  }, [primaryToken]);

  useEffect(() => {
    if (!tvl || !LPTokenAmount || !totalLpSupply) {
      return;
    }
    getLpValue();
  }, [tvl]);

  useEffect(() => {
    if (!userLpValue || addedTotal) return;
    addTotal();
  }, [userLpValue]);

  return (
    <>
      {/* UNISWAP V2 POOL 예시 */}
      {/* {userLpValue ? ( */}
      {tvl ? (
        <div className="bg-fuchsia-100 mx-auto rounded-3xl w-11/12 h-fit pb-6 mt-4 mb-10 flex flex-col gap-2">
          {/* 헤더 */}
          <div className="dm-sans-defi flex flex-row justify-between items-center m-4">
            <div>UNISWAP V2 POOL</div>
            <div className="flex flex-col items-start">
              {/* 수익률 */}
              <div className="text-rose-500">-%0.04</div>
              {/* 수익률 기간토글 */}
              <div className="flex flex-row gap-1 items-center text-xs ">
                <div className="flex flex-row justify-evenly rounded-md border border-purple-950 divide-x divide-purple-950">
                  <button className="px-1 bg-green-200 hover:bg-green-100 rounded-s-md">
                    D
                  </button>
                  <button className="px-1 hover:bg-green-100">W</button>
                  <button className="px-1 hover:bg-green-100">M</button>
                  <button className="px-1 hover:bg-green-100 rounded-e-md">
                    Y
                  </button>
                </div>
                <span className=" text-base">ⓘ</span>
              </div>
            </div>
          </div>
          {/* 바디 */}
          <div className="pb-1">
            {/* 구분 */}
            <div className="dm-sans-defi-info flex flex-row justify-between mx-4 pb-2">
              <div>PAIR AMOUNT ⓘ</div>
              <div>USD VALUE </div>
            </div>
            {/* 제공한 페어 */}
            <div className="dm-sans-defi-info-light flex flex-row justify-between items-center mx-4">
              <div className="flex flex-col justify-center">
                <div>
                  {/* {LPTokenName}: {_pairname} */}
                  {/* {LPTokenName} */}
                  {reserve0.toFixed(6)} {symbol0}
                </div>
                <div className="m-sans-body-reveal">
                  {/* {LPTokenName}: {_pairname} */}
                  {/* {_pairname} */}
                  {reserve1.toFixed(6)} {symbol1}
                </div>
              </div>
              <div>
                {/* <div>{userLpValue}</div> */}
                <div className="text-xl">${userLpValue}</div>
              </div>
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
