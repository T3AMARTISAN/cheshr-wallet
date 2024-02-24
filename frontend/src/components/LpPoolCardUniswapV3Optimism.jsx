import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
// import JSBI from "jsbi";
import * as JSBI from "jsbi/dist/jsbi-umd.js";
//npm i jsbi
//npm install jsbi@3.2.5

import { abiOptimismToken } from "../utils/abiToken";
import { UniswapV3 } from "../utils/uniswapV3FactoryContract.js";
import { abiLPUniV3Optimism } from "../utils/abiLPUniV3";

const LpPoolCardUniswapV3Optimism = ({
  tokenId,
  fee,
  feeGrowthInside0LastX128,
  feeGrowthInside1LastX128,
  liquidity,
  tickLower,
  tickUpper,
  token0,
  token1,
  time,
  totalValue,
  setTotalValue,
  lpV3Array,
  provider,
}) => {
  const { currentProvider, currentAccount, currentNetwork } =
    useOutletContext();

  const [sqrtPriceX96, setSqrtPriceX96] = useState();
  const [Decimal0, setDecimal0] = useState();
  const [Decimal1, setDecimal1] = useState();
  const [token0Amount, setToken0Amount] = useState();
  const [token1Amount, setToken1Amount] = useState();
  const [feeGrowth0Low, setFeeGrowth0Low] = useState(0);
  const [feeGrowth1Low, setFeeGrowth1Low] = useState(0);
  const [feeGrowth0Hi, setFeeGrowth0Hi] = useState(0);
  const [feeGrowth1Hi, setFeeGrowth1Hi] = useState(0);
  const [v3PoolContract, setV3PoolContract] = useState();
  const [feeGrowthGlobal0, setFeeGrowthGlobal0] = useState(0);
  const [feeGrowthGlobal1, setFeeGrowthGlobal1] = useState(0);
  const [currentTick, setCurrentTick] = useState(0);
  const [uncollectedFees0, setUncollectedFees0] = useState(0); // 미청구 수수료 중 token0으로 받은 분량
  const [uncollectedFees1, setUncollectedFees1] = useState(0); // 미청구 수수료 중 token1으로 받은 분량
  const [price0, setPrice0] = useState(); // token0의 시세 저장하는 상태변수
  const [price1, setPrice1] = useState(); // token1의 시세 저장하는 상태변수
  const [lpDollarValue, setLpDollarValue] = useState(); // LP 지분의 총 달러가치
  const [feeDollarValue, setFeeDollarValue] = useState(); // 미청구 수수료의 총 달러가치
  const [symbol0, setSymbol0] = useState();
  const [symbol1, setSymbol1] = useState();
  const [addedTotal, setAddedTotal] = useState(false);

  //lp 지분, 미청구 수수료 빅넘버 계산 시 필요한 값들
  // https://blog.uniswap.org/uniswap-v3-math-primer-2 코드 참고해서 작성
  const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
  const ZERO = JSBI.BigInt(0);
  const Q128 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128));
  const Q256 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(256));

  //v3Pool 컨트랙트에서 현재 틱 계산하기 위한 sqrt 값 불러오기
  const getSqrtPrice = async () => {
    try {
      if (+liquidity == 0) return;
      var pairContract;

      var factoryAbi = UniswapV3.factoryAbi;
      var factoryAddress = UniswapV3.factoryAddress;

      const factoryContract = new ethers.Contract(
        factoryAddress,
        factoryAbi,
        provider
      );

      // console.log("87", factoryContract);

      // console.log("89", token0, token1, fee);

      var pairContractAddress = await factoryContract.getPool(
        token0,
        token1,
        fee
      );
      pairContractAddress = pairContractAddress.toLowerCase();

      if (!abiLPUniV3Optimism[pairContractAddress]) {
        // setSqrtPriceX96("1");
        //abi DB에 없는 경우 이더스캔으로 abi 가져와서 컨트랙트 구성
        const contract_url = `https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_OPTIMISMSCAN_API_KEY}`;
        const contract_response = await fetch(contract_url);
        var { result } = await contract_response.json();
        const contract_abi = result[0].ABI;
        pairContract = new ethers.Contract(
          pairContractAddress,
          contract_abi,
          provider
        );
      } else {
        pairContract = new ethers.Contract(
          pairContractAddress,
          abiLPUniV3Optimism[pairContractAddress],
          provider
        );
      }

      setV3PoolContract(pairContract);
      // console.log("118", pairContract);
      // var fee2 = await pairContract.fee();
      // console.log("132", fee2);
      var sqrt = await pairContract.slot0();
      sqrt = sqrt[0].toString();
      setSqrtPriceX96(sqrt);
    } catch (error) {
      console.log("getsqrtprice error", error, pairContractAddress);
    }
  };

  //두 페어의 컨트랙트에서 decimals0, decimals1, price0, price1 불러오기
  const getPairTokensInfo = async () => {
    try {
      setTimeout(async () => {
        if (liquidity == 0) return;

        var pair_0;
        var pair_1;
        var contract_0;
        var contract_1;

        if (!abiOptimismToken[token0]) {
          //abi DB에 없는 경우. 현재 테스트 계정에 맞추어 세팅되어 이 곳에 들어오는 토큰 없음. 추후 에러 처리 필요
          //abi DB에 없는 경우 이더스캔으로 abi 가져와서 컨트랙트 구성
          const contract_url = `https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_OPTIMISMSCAN_API_KEY}`;
          const contract_response = await fetch(contract_url);
          var { result } = await contract_response.json();
          // console.log(result);
          const contract_abi = result[0].ABI;
          // console.log(token0, "136", contract_abi);
          contract_0 = new ethers.Contract(token0, contract_abi, provider);
        } else {
          contract_0 = new ethers.Contract(
            token0,
            abiOptimismToken[token0],
            provider
          );
        }
        const decimal_0 = await contract_0.decimals(); //bigint
        var symbol_0 = await contract_0.symbol();
        setSymbol0(symbol_0);

        if (symbol_0 == "WETH") {
          // console.log("153", symbol_0);
          //WETH-USDT인 경우 ETH-USDT로 변환해주어야 함
          pair_0 = "ETHUSDT";
        } else if (symbol_0 == "WMATIC") {
          // console.log("157", symbol_0);
          //WMATIC-USDT인 경우 ETH-USDT로 변환해주어야 함
          pair_0 = "MATICUSDT";
        } else {
          // console.log("161", symbol_0);
          pair_0 = symbol_0 + "USDT";
        }
        setDecimal0(Number(decimal_0));

        if (!abiOptimismToken[token1]) {
          // console.log("168 add in abi file", token1);
          //abi DB에 없는 경우 이더스캔으로 abi 가져와서 컨트랙트 구성
          const contract_url = `https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_OPTIMISMSCAN_API_KEY}`;
          const contract_response = await fetch(contract_url);
          var { result } = await contract_response.json();
          const contract_abi = result[0].ABI;
          contract_1 = new ethers.Contract(token1, contract_abi, provider);
        } else {
          contract_1 = new ethers.Contract(
            token1,
            abiOptimismToken[token1],
            provider
          );
        }
        const decimal_1 = await contract_1.decimals();
        var symbol_1 = await contract_1.symbol();
        setSymbol1(symbol_1);

        if (symbol_1 == "WETH") {
          // console.log("186", symbol_1);
          //WETH-USDT인 경우 ETH-USDT로 변환해주어야 함
          pair_1 = "ETHUSDT";
        } else if (symbol_1 == "WMATIC") {
          // console.log("190", symbol_1);
          //WMATIC-USDT인 경우 ETH-USDT로 변환해주어야 함
          pair_1 = "MATICUSDT";
        } else {
          // console.log("194", symbol_1);
          pair_1 = symbol_1 + "USDT";
        }

        setDecimal1(Number(decimal_1));

        //바이낸스로 시세 불러오기

        if (pair_0 != "USDTUSDT") {
          //USDT-USDT인 경우 USDT 가격 = 1이므로 api 막아야 함
          const response0 = await axios.get(
            `https://api.binance.com/api/v1/ticker/price?symbol=${pair_0}`
          );
          var price0 = response0.data.price;
          setPrice0(price0);
        } else {
          //USDT-USDT인 경우 USDT 가격 = 1이므로 api 막아야 함
          setPrice0(1);
        }

        if (pair_1 != "USDTUSDT") {
          const response1 = await axios.get(
            `https://api.binance.com/api/v1/ticker/price?symbol=${pair_1}`
          );
          var price1 = response1.data.price;
          // console.log(pair_1, price1);
          setPrice1(price1);
        } else {
          setPrice1(1);
        }
      }, time * 100); //  setTimeout(async () => { }, time * 100);
    } catch (error) {
      console.log(token0, token1, "add abi", error);
    }
  };

  //sqrt에서 현재 틱 값 currenTick 계산
  function getTickAtSqrtPrice() {
    let tick = Math.floor(
      Math.log((sqrtPriceX96 / Q96) ** 2) / Math.log(1.0001)
    );
    setCurrentTick(tick);
  }

  //사용자가 보유한 LP 지분 정보(각 페어 보유한 수량)를 NFT 정보(Defi component에서 프롭스로 내려줌)를 기반으로 계산하기
  async function getTokenAmounts(
    liquidity,
    sqrtPriceX96,
    tickLower,
    tickUpper,
    Decimal0,
    Decimal1
  ) {
    try {
      //현재 틱이 위치한 범위에 따라 토큰 수량 amount0, amount1 계산 식이 달라짐
      let sqrtRatioA = Math.sqrt(1.0001 ** tickLower);
      let sqrtRatioB = Math.sqrt(1.0001 ** tickUpper);
      let sqrtPrice = sqrtPriceX96 / Q96;
      let amount0 = 0;
      let amount1 = 0;
      if (currentTick < tickLower) {
        amount0 = Math.floor(
          liquidity * ((sqrtRatioB - sqrtRatioA) / (sqrtRatioA * sqrtRatioB))
        );
      } else if (currentTick >= tickUpper) {
        amount1 = Math.floor(liquidity * (sqrtRatioB - sqrtRatioA));
      } else if (currentTick >= tickLower && currentTick < tickUpper) {
        amount0 = Math.floor(
          liquidity * ((sqrtRatioB - sqrtPrice) / (sqrtPrice * sqrtRatioB))
        );
        amount1 = Math.floor(liquidity * (sqrtPrice - sqrtRatioA));
      }

      // let amount0Human = (amount0 / 10 ** Decimal0).toFixed(Decimal0);
      // let amount1Human = (amount1 / 10 ** Decimal1).toFixed(Decimal1);

      let amount0Human = amount0 / 10 ** Decimal0;
      let amount1Human = amount1 / 10 ** Decimal1;

      // console.log("Amount Token0 in lowest decimal: " + amount0);
      // console.log("Amount Token1 in lowest decimal: " + amount1);
      // console.log("Amount Token0 : " + amount0Human);
      // console.log("Amount Token1 : " + amount1Human);
      setToken0Amount(amount0Human);
      setToken1Amount(amount1Human);
      return [amount0, amount1];
    } catch (error) {
      console.log(error);
    }
  }

  // https://github.com/Uniswap/v3-core/blob/main/contracts/libraries/Tick.sol 코드 참고해서 작성
  // https://blog.uniswap.org/uniswap-v3-math-primer-2 코드 참고해서 작성

  //미청구 수수료 계산에 필요한 파라미터 feeGrowthLow, feeGrowthHigh, feeGrowthGlobal 계산
  const getfeeAboveBelow = async () => {
    try {
      setTimeout(async () => {
        if (!v3PoolContract) return;

        ////여기부부터 줄이기 가능
        var feeOutsideOfTickLower = await v3PoolContract.ticks(tickLower);
        var feeOutsideOfTickLower0X128 =
          feeOutsideOfTickLower.feeGrowthOutside0X128;
        setFeeGrowth0Low(feeOutsideOfTickLower0X128);
        var feeOutsideOfTickLower1X128 =
          feeOutsideOfTickLower.feeGrowthOutside1X128;
        setFeeGrowth1Low(feeOutsideOfTickLower1X128);

        var feeOutsideOfTickUpper = await v3PoolContract.ticks(tickUpper);
        var feeOutsideOfTickUpper0X128 =
          feeOutsideOfTickUpper.feeGrowthOutside0X128;
        setFeeGrowth0Hi(feeOutsideOfTickUpper0X128);
        var feeOutsideOfTickUpper1X128 =
          feeOutsideOfTickUpper.feeGrowthOutside1X128;
        setFeeGrowth1Hi(feeOutsideOfTickUpper1X128);

        var feeGrowthGlobal0 = await v3PoolContract.feeGrowthGlobal0X128();
        setFeeGrowthGlobal0(feeGrowthGlobal0);

        var feeGrowthGlobal1 = await v3PoolContract.feeGrowthGlobal1X128();
        setFeeGrowthGlobal1(feeGrowthGlobal1);
      }, time * 100);
    } catch (error) {
      console.log(error);
    }
  };

  // this handles the over and underflows which is needed for all subtraction in the fees math
  // 수수료 계산 시 오버플로우 숫자에 대해서도 뺄셈 계산할 수 있는 식
  // https://blog.uniswap.org/uniswap-v3-math-primer-2 코드 참고해서 작성
  function subIn256(x, y) {
    const difference = JSBI.subtract(x, y);
    if (JSBI.lessThan(difference, ZERO)) {
      return JSBI.add(Q256, difference);
    } else {
      return difference;
    }
  }

  //미청구 수수료 계산
  // https://blog.uniswap.org/uniswap-v3-math-primer-2 코드 참고해서 작성
  async function getFees() {
    try {
      if (
        !feeGrowthGlobal0 ||
        !feeGrowthGlobal1 ||
        !feeGrowth0Low ||
        !feeGrowth1Low ||
        liquidity == 0 ||
        !Decimal0 ||
        !Decimal1
      )
        return;

      // all needs to be bigNumber
      var feeGrowthGlobal_0 = feeGrowthGlobal0.toString();
      feeGrowthGlobal_0 = JSBI.BigInt(feeGrowthGlobal_0);

      var feeGrowthGlobal_1 = feeGrowthGlobal1.toString();
      feeGrowthGlobal_1 = JSBI.BigInt(feeGrowthGlobal_1);

      var tickLowerFeeGrowthOutside_0 = feeGrowth0Low.toString();
      tickLowerFeeGrowthOutside_0 = JSBI.BigInt(tickLowerFeeGrowthOutside_0);

      var tickLowerFeeGrowthOutside_1 = feeGrowth1Low.toString();
      tickLowerFeeGrowthOutside_1 = JSBI.BigInt(tickLowerFeeGrowthOutside_1);

      var tickUpperFeeGrowthOutside_0 = feeGrowth0Hi.toString();
      tickUpperFeeGrowthOutside_0 = JSBI.BigInt(tickUpperFeeGrowthOutside_0);

      var tickUpperFeeGrowthOutside_1 = feeGrowth1Hi.toString();
      tickUpperFeeGrowthOutside_1 = JSBI.BigInt(tickUpperFeeGrowthOutside_1);
      // preset variables to 0 BigNumber
      var tickLowerFeeGrowthBelow_0 = ZERO;
      var tickLowerFeeGrowthBelow_1 = ZERO;
      var tickUpperFeeGrowthAbove_0 = ZERO;
      var tickUpperFeeGrowthAbove_1 = ZERO;

      // As stated above there is different math needed if the position is in or out of range
      // If current tick is above the range fg- fo,iu Growth Above range

      if (currentTick >= tickUpper) {
        tickUpperFeeGrowthAbove_0 = subIn256(
          feeGrowthGlobal_0,
          tickUpperFeeGrowthOutside_0
        );
        tickUpperFeeGrowthAbove_1 = subIn256(
          feeGrowthGlobal_1,
          tickUpperFeeGrowthOutside_1
        );
      } else {
        // Else if current tick is in range only need fg for upper growth
        tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutside_0;
        tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutside_1;
      }
      // If current tick is in range  only need fg for lower growth

      if (currentTick >= tickLower) {
        tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutside_0;
        tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutside_1;
      } else {
        // If current tick is above the range fg- fo,il Growth below range
        tickLowerFeeGrowthBelow_0 = subIn256(
          feeGrowthGlobal_0,
          tickLowerFeeGrowthOutside_0
        );
        tickLowerFeeGrowthBelow_1 = subIn256(
          feeGrowthGlobal_1,
          tickLowerFeeGrowthOutside_1
        );
      }

      //   fr(t1) For both token0 and token1
      let fr_t1_0 = subIn256(
        subIn256(feeGrowthGlobal_0, tickLowerFeeGrowthBelow_0),
        tickUpperFeeGrowthAbove_0
      );
      let fr_t1_1 = subIn256(
        subIn256(feeGrowthGlobal_1, tickLowerFeeGrowthBelow_1),
        tickUpperFeeGrowthAbove_1
      );
      // feeGrowthInside to BigNumber
      let feeGrowthInsideLast_0 = JSBI.BigInt(feeGrowthInside0LastX128);
      let feeGrowthInsideLast_1 = JSBI.BigInt(feeGrowthInside1LastX128);

      // The final calculations uncollected fees formula
      // for both token 0 and token 1 since we now know everything that is needed to compute it
      // subtracting the two values and then multiplying with liquidity l *(fr(t1) - fr(t0))

      let uncollectedFees_0 =
        (liquidity * subIn256(fr_t1_0, feeGrowthInsideLast_0)) / Q128;

      let uncollectedFees_1 =
        (liquidity * subIn256(fr_t1_1, feeGrowthInsideLast_1)) / Q128;

      // console.log(
      //   "Amount fees token 0 in lowest decimal: " +
      //     Math.floor(uncollectedFees_0)
      // );
      // console.log(
      //   "Amount fees token 1 in lowest decimal: " +
      //     Math.floor(uncollectedFees_1)
      // );

      // Decimal adjustment to get final results
      let uncollectedFeesAdjusted_0 = (
        uncollectedFees_0 / JSBI.BigInt(10 ** Decimal0)
      ).toFixed(Decimal0);
      setUncollectedFees0(uncollectedFeesAdjusted_0);
      let uncollectedFeesAdjusted_1 = (
        uncollectedFees_1 / JSBI.BigInt(10 ** Decimal1)
      ).toFixed(Decimal1);
      setUncollectedFees1(uncollectedFeesAdjusted_1);
      // console.log(
      //   "Amount fees token 0 Human format: " + uncollectedFeesAdjusted_0
      // );
      // console.log(
      //   "Amount fees token 1 Human format: " + uncollectedFeesAdjusted_1
      // );
    } catch (error) {
      console.log(error);
    }
  }

  //LP 와 수수료의 달러 가치 계산
  //getPairTokensInfo와 분리한 이유는, 4개 상태변수 필요해, getPairTokensInfo 에 있으면 useEffect 너무 많이 트리거 되어서 프로바이더 지나치게 많이 사용됨
  const getDollarValue = () => {
    if (!price0 || !price1) return;

    var lpDollar = token0Amount * price0 + token1Amount * price1;
    setLpDollarValue(lpDollar);
    var feeDollar = uncollectedFees0 * price0 + uncollectedFees1 * price1;
    setFeeDollarValue(feeDollar);
  };

  const addTotal = async () => {
    try {
      if (!lpDollarValue) return;
      if (addedTotal == false) {
        var total =
          Number(totalValue) + Number(lpDollarValue) + Number(feeDollarValue);
        setTotalValue(total);
        setAddedTotal(true);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!provider) return;
    if (liquidity > 0) {
      getSqrtPrice();
    }
  }, [provider]);

  useEffect(() => {
    if (!provider || liquidity == 0) return;
    getPairTokensInfo();
  }, [provider]);

  useEffect(() => {
    if (!sqrtPriceX96) return;
    getTickAtSqrtPrice();
  }, [sqrtPriceX96]);

  useEffect(() => {
    if (!currentTick) return;
    getTokenAmounts(
      liquidity,
      sqrtPriceX96,
      tickLower,
      tickUpper,
      Decimal0,
      Decimal1
    );
  }, [Decimal0, Decimal1, currentTick]);

  useEffect(() => {
    if (!v3PoolContract || !sqrtPriceX96) return;
    getfeeAboveBelow();
  }, [v3PoolContract, sqrtPriceX96]);

  useEffect(() => {
    getFees();
  }, [
    feeGrowthGlobal1,
    feeGrowth1Low,
    feeGrowth1Hi,
    feeGrowthInside1LastX128,
    Decimal0,
    Decimal1,
    currentTick,
  ]);

  useEffect(() => {
    if (!price0 || !price1) return;
    getDollarValue();
  }, [token1Amount, uncollectedFees1, price1]);

  useEffect(() => {
    if (!lpDollarValue || addedTotal) return;
    addTotal();
  }, [lpDollarValue]);

  return (
    <>
      {lpDollarValue > 0 ? (
        <div className="bg-fuchsia-100 mx-auto rounded-3xl w-11/12 h-fit pb-2 my-10 flex flex-col gap-2">
          {/* 헤더 */}
          <div className="dm-sans-defi flex flex-row justify-between m-4">
            {/* 카드이름 */}
            <div className="flex flex-col">
              <div>UNISWAP V3 POOL</div>
              <div className="text-sm">TOKENID #{tokenId}</div>
            </div>
            <div className="flex flex-col items-start">
              {/* 수익률 */}
              <div className="text-green-500">+%1.78</div>
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
          <div className="pb-5">
            {/* 구분 */}
            <div className="dm-sans-defi-info flex flex-row justify-between mx-4 pb-2">
              <div>PAIR AMOUNT ⓘ</div>
              <div>USD VALUE</div>
            </div>
            {/* 제공한 페어 */}
            <div className="dm-sans-defi-info-light flex flex-row justify-between items-center mx-4">
              <div className="flex flex-col justify-center">
                <div>
                  {/* {LPTokenName}: {_pairname} */}
                  {/* {LPTokenName} */}
                  {`${Number(token0Amount).toFixed(6)} ${symbol0}`}
                </div>
                <div className="m-sans-body-reveal">
                  {/* {LPTokenName}: {_pairname} */}
                  {/* {_pairname} */}
                  {`${Number(token1Amount).toFixed(6)} ${symbol1}`}
                </div>
              </div>
              <div>
                {/* <div>{userLpValue}</div> */}
                <div className="text-xl">{`$${Number(lpDollarValue).toFixed(
                  4
                )}`}</div>
              </div>
            </div>
            {/* 보상 */}
            <div className="pt-6">
              <div className="dm-sans-defi-info flex flex-row justify-between mx-4 pb-2">
                <div>REWARD AMOUNT ⓘ</div>
                <div>USD VALUE</div>
              </div>
              <div className="dm-sans-defi-info-light flex flex-row justify-between items-center mx-4">
                <div className="flex flex-col justify-center">
                  <div>
                    {/* {LPTokenName}: {_pairname} */}
                    {/* {LPTokenName} */}
                    {`${Number(uncollectedFees0).toFixed(6)} ${symbol0}`}
                  </div>
                  <div>
                    {/* {LPTokenName}: {_pairname} */}
                    {/* {_pairname} */}
                    {`${Number(uncollectedFees1).toFixed(6)} ${symbol1}`}
                  </div>
                </div>
                <div>
                  {/* <div>{userLpValue}</div> */}
                  <div className="text-xl">{`$${Number(feeDollarValue).toFixed(
                    4
                  )}`}</div>
                </div>
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

export default LpPoolCardUniswapV3Optimism;
