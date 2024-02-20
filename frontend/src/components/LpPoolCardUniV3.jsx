import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
// import JSBI from "jsbi";
import * as JSBI from "jsbi/dist/jsbi-umd.js";

//npm i jsbi
//npm install jsbi@3.2.5
//npm install bignumber.js

import { abiLPUniV3 } from "../utils/abiLPUniV3.js";

import { abiMainnetToken } from "../utils/abiMainnetToken.js";
// import BigNumber from "bignumber.js";
// import { BigNumber } from "./node_modules/bignumber.js/bignumber.mjs";

import { useOutletContext } from "react-router-dom";

//test lp CA와 지갑은 현재 useEffect 인풋값으로 들어감.

const LPPoolCardUniV3 = ({
  tokenId,
  fee,
  feeGrowthInside0LastX128,
  feeGrowthInside1LastX128,
  liquidity,
  nonce,
  operator,
  tickLower,
  tickUpper,
  token0,
  token1,
  tokensOwed0,
  tokensOwed1,
  time,
}) => {
  const { currentProvider, setCurrentAccount, currentAccount } =
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

  //lp 지분, 미청구 수수료 빅넘버 계산 시 필요한 값들
  // https://blog.uniswap.org/uniswap-v3-math-primer-2 코드 참고해서 작성
  const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
  const ZERO = JSBI.BigInt(0);
  const Q128 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128));
  const Q256 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(256));

  const factoryAbi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint24",
          name: "fee",
          type: "uint24",
        },
        {
          indexed: true,
          internalType: "int24",
          name: "tickSpacing",
          type: "int24",
        },
      ],
      name: "FeeAmountEnabled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "oldOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnerChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token0",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "token1",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint24",
          name: "fee",
          type: "uint24",
        },
        {
          indexed: false,
          internalType: "int24",
          name: "tickSpacing",
          type: "int24",
        },
        {
          indexed: false,
          internalType: "address",
          name: "pool",
          type: "address",
        },
      ],
      name: "PoolCreated",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "tokenA", type: "address" },
        { internalType: "address", name: "tokenB", type: "address" },
        { internalType: "uint24", name: "fee", type: "uint24" },
      ],
      name: "createPool",
      outputs: [{ internalType: "address", name: "pool", type: "address" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint24", name: "fee", type: "uint24" },
        { internalType: "int24", name: "tickSpacing", type: "int24" },
      ],
      name: "enableFeeAmount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint24", name: "", type: "uint24" }],
      name: "feeAmountTickSpacing",
      outputs: [{ internalType: "int24", name: "", type: "int24" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint24", name: "", type: "uint24" },
      ],
      name: "getPool",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "parameters",
      outputs: [
        { internalType: "address", name: "factory", type: "address" },
        { internalType: "address", name: "token0", type: "address" },
        { internalType: "address", name: "token1", type: "address" },
        { internalType: "uint24", name: "fee", type: "uint24" },
        { internalType: "int24", name: "tickSpacing", type: "int24" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_owner", type: "address" }],
      name: "setOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  //v3Pool 컨트랙트에서 현재 틱 계산하기 위한 sqrt 값 불러오기
  const getSqrtPrice = async () => {
    try {
      if (+liquidity == 0) return;

      const factoryContract = new ethers.Contract(
        "0x1f98431c8ad98523631ae4a59f267346ea31f984",
        factoryAbi,
        currentProvider
      );

      var pairContractAddress = await factoryContract.getPool(
        token0,
        token1,
        fee
      );

      pairContractAddress = pairContractAddress.toLowerCase();

      if (abiLPUniV3[pairContractAddress] == "") {
        setSqrtPriceX96("1");
      } else {
        const pairContract = new ethers.Contract(
          pairContractAddress,
          abiLPUniV3[pairContractAddress],
          currentProvider
        );

        setV3PoolContract(pairContract);
        var sqrt = await pairContract.slot0();
        sqrt = sqrt[0].toString();
        setSqrtPriceX96(sqrt);
      }
    } catch (error) {
      console.log("getsqrtprice error", error);
    }
  };

  //두 페어의 컨트랙트에서 decimals0, decimals1, price0, price1 불러오기
  const getPairTokensInfo = async () => {
    try {
      setTimeout(async () => {
        if (liquidity == 0) return;

        if (abiMainnetToken[token0] == "") {
          //abi DB에 없는 경우. 현재 테스트 계정에 맞추어 세팅되어 이 곳에 들어오는 토큰 없음. 추후 에러 처리 필요
          setDecimal0(18);
        } else {
          const contract_0 = new ethers.Contract(
            token0,
            abiMainnetToken[token0],
            currentProvider
          );
          const decimal_0 = await contract_0.decimals(); //bigint
          var symbol_0 = await contract_0.symbol();
          setSymbol0(symbol_0);
          if (symbol_0 == "WETH") {
            //WETH-USDT인 경우 ETH-USDT로 변환해주어야 함
            var pair_0 = "ETHUSDT";
          } else {
            var pair_0 = symbol_0 + "USDT";
          }
          setDecimal0(Number(decimal_0));
        }

        if (abiMainnetToken[token1] == "") {
          //abi DB에 없는 경우. 현재 테스트 계정에 맞추어 세팅되어 이 곳에 들어오는 토큰 없음. 추후 에러 처리 필요
          setDecimal1(18);
        } else {
          const contract_1 = new ethers.Contract(
            token1,
            abiMainnetToken[token1],
            currentProvider
          );
          const decimal_1 = await contract_1.decimals();
          var symbol_1 = await contract_1.symbol();
          setSymbol1(symbol_1);

          if (symbol_1 == "WETH") {
            //WETH-USDT인 경우 ETH-USDT로 변환해주어야 함
            var pair_1 = "ETHUSDT";
          } else {
            var pair_1 = symbol_1 + "USDT";
          }

          setDecimal1(Number(decimal_1));
        }

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
      }, time * 100);
    } catch (error) {
      console.log(error);
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
      if (!v3PoolContract) return;

      var feeOutsideOfTickLower0X128 = await v3PoolContract.ticks(tickLower);
      feeOutsideOfTickLower0X128 =
        feeOutsideOfTickLower0X128.feeGrowthOutside0X128;
      setFeeGrowth0Low(feeOutsideOfTickLower0X128);

      var feeOutsideOfTickLower1X128 = await v3PoolContract.ticks(tickLower);
      feeOutsideOfTickLower1X128 =
        feeOutsideOfTickLower1X128.feeGrowthOutside1X128;
      setFeeGrowth1Low(feeOutsideOfTickLower1X128);

      var feeOutsideOfTickUpper0X128 = await v3PoolContract.ticks(tickUpper);
      feeOutsideOfTickUpper0X128 =
        feeOutsideOfTickUpper0X128.feeGrowthOutside0X128;
      setFeeGrowth0Hi(feeOutsideOfTickUpper0X128);

      var feeOutsideOfTickUpper1X128 = await v3PoolContract.ticks(tickUpper);
      feeOutsideOfTickUpper1X128 =
        feeOutsideOfTickUpper1X128.feeGrowthOutside1X128;
      setFeeGrowth1Hi(feeOutsideOfTickUpper1X128);

      var feeGrowthGlobal0 = await v3PoolContract.feeGrowthGlobal0X128();
      setFeeGrowthGlobal0(feeGrowthGlobal0);

      var feeGrowthGlobal1 = await v3PoolContract.feeGrowthGlobal1X128();
      setFeeGrowthGlobal1(feeGrowthGlobal1);
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
        liquidity == 0
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

  useEffect(() => {
    if (!currentProvider) return;
    if (liquidity > 0) {
      getSqrtPrice();
    }
  }, [currentProvider]);

  useEffect(() => {
    if (!currentProvider || liquidity == 0) return;
    getPairTokensInfo();
  }, [currentProvider]);

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

  return (
    <>
      {liquidity > 0 ? (
        <div className="bg-neutral-400 rounded-lg w-11/12 h-fit pb-10 my-10 flex flex-col">
          <div className="flex flex-row justify-between m-4">
            <div>UNISWAP V3 POOL</div>

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
              <div>{`${symbol0} - ${symbol1}`}</div>
              <div>{tokenId} </div>
            </div>
            <div className="flex flex-col gap-2">
              <div>Amount</div>
              <div>{`${Number(token0Amount).toFixed(6)} ${symbol0}`} </div>
              <div>{`${Number(token1Amount).toFixed(6)} ${symbol1}`} </div>
              <div>Uncollected Fees</div>
              <div>{`${Number(uncollectedFees0).toFixed(6)} ${symbol0}`}</div>
              <div>{`${Number(uncollectedFees1).toFixed(6)} ${symbol1}`}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div>USDT</div>
              <div>{`$ ${Number(lpDollarValue).toFixed(6)}`}</div>
              <div>{`$ ${Number(feeDollarValue).toFixed(6)}`}</div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default LPPoolCardUniV3;
