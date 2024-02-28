import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
// import JSBI from "jsbi";
import * as JSBI from "jsbi/dist/jsbi-umd.js";
//npm i jsbi
//npm install jsbi@3.2.5
import { FaExternalLinkAlt } from "react-icons/fa";

import { abiLPUniV3Mainnet } from "../utils/abiLPUniV3.js";
import { abiMainnetToken } from "../utils/abiToken.js";
import { UniswapV3 } from "../utils/uniswapV3FactoryContract.js";

//

const LpPoolCardUniswapV3 = ({
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

  provider,
}) => {
  const { currentProvider, currentAccount, totalValue, setTotalValue } =
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
  const [reserve0, setReserve0] = useState();
  const [reserve1, setReserve1] = useState();
  const [lpDollarValue, setLpDollarValue] = useState(); // LP 지분의 총 달러가치
  const [feeDollarValue, setFeeDollarValue] = useState(); // 미청구 수수료의 총 달러가치
  const [symbol0, setSymbol0] = useState();
  const [symbol1, setSymbol1] = useState();
  const [addedTotal, setAddedTotal] = useState(false);
  const [apy, setApy] = useState();
  const [v3PoolAddress, setV3PoolAddress] = useState();
  const [isInRange, setIsInRange] = useState();
  // const [toggleState, setToggleState] = useState();
  const [apyConstant, setApyConstant] = useState(365);

  const getApy = async () => {
    if (!Decimal0 || !v3PoolAddress || !symbol0 || !symbol1) return;
    var tvl;
    var total;

    tvl = reserve0 * price0 + reserve1 * price1;

    async function getTotalFromSwapTx() {
      if (!Decimal0 || !tvl) return;

      const erc20Abi = [
        "event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
      ];

      const contract = new ethers.Contract(v3PoolAddress, erc20Abi, provider);

      const startBlock = (await currentProvider.getBlockNumber()) - 1000; // Start block number
      const endBlock = await currentProvider.getBlockNumber();

      const filter = {
        fromBlock: startBlock,
        toBlock: endBlock,
        address: v3PoolAddress,
        topics: [
          ethers.utils.id(
            "Swap(address,address,int256,int256,uint160,uint128,int24)"
          ),
          null,
          null,
        ],
      };
      const logs = await provider.getLogs(filter);

      var parsedLog;
      var totalToken0Swaped = [];
      logs.forEach((log) => {
        parsedLog = contract.interface.parseLog(log);
        totalToken0Swaped.push(Math.abs(Number(parsedLog.args.amount0)));
      });

      var sum = 0;
      for (let i = 0; i < totalToken0Swaped.length; i++) {
        sum += totalToken0Swaped[i];
      }
      var dayVolume = (sum * price0) / 10 ** Decimal0;

      var apyTemp = ((dayVolume * (fee / 100000) * 365) / tvl) * 100;
      setApy(apyTemp);
    }
    try {
      await getTotalFromSwapTx();
    } catch (err) {
      console.error(`Error fetching logs for address: haha`, err);
    }
  };

  useEffect(() => {
    if (
      !provider ||
      !Decimal0 ||
      !v3PoolAddress ||
      !reserve0 ||
      !price0 ||
      !reserve1 ||
      !price1
    )
      return;

    getApy();
  }, [provider, Decimal0, v3PoolAddress, reserve0, price0, reserve1, price1]);

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

      var pairContractAddress = await factoryContract.getPool(
        token0,
        token1,
        fee
      );

      pairContractAddress = pairContractAddress.toLowerCase();
      setV3PoolAddress(pairContractAddress);

      if (!abiLPUniV3Mainnet[pairContractAddress]) {
        // setSqrtPriceX96("1");
        //abi DB에 없는 경우 이더스캔으로 abi 가져와서 컨트랙트 구성
        const contract_url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
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
          abiLPUniV3Mainnet[pairContractAddress],
          provider
        );
      }
      setV3PoolContract(pairContract);
      var sqrt = await pairContract.slot0();
      sqrt = sqrt[0].toString();
      setSqrtPriceX96(sqrt);
    } catch (error) {
      console.log("getsqrtprice error", error);
    }
  };

  //두 페어의 컨트랙트에서 decimals0, decimals1, price0, price1 불러오기
  const getPairTokensInfo = async () => {
    try {
      setTimeout(async () => {
        if (liquidity == 0 || lpDollarValue || !v3PoolAddress) return;

        var pair_0;
        var pair_1;
        var contract_0;
        var contract_1;

        if (!abiMainnetToken[token0]) {
          //abi DB에 없는 경우. 현재 테스트 계정에 맞추어 세팅되어 이 곳에 들어오는 토큰 없음. 추후 에러 처리 필요
          //abi DB에 없는 경우 이더스캔으로 abi 가져와서 컨트랙트 구성
          const contract_url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
          const contract_response = await fetch(contract_url);
          var { result } = await contract_response.json();
          const contract_abi = result[0].ABI;
          contract_0 = new ethers.Contract(token0, contract_abi, provider);
        } else {
          contract_0 = new ethers.Contract(
            token0,
            abiMainnetToken[token0],
            provider
          );
        }
        const decimal_0 = await contract_0.decimals(); //bigint
        var symbol_0 = await contract_0.symbol();
        setSymbol0(symbol_0);
        var reserve_0 = await contract_0.balanceOf(v3PoolAddress);
        reserve_0 = Number(reserve_0 / 10 ** decimal_0);
        setReserve0(reserve_0);

        if (symbol_0 == "WETH") {
          //WETH-USDT인 경우 ETH-USDT로 변환해주어야 함
          pair_0 = "ETHUSDT";
        } else if (symbol_0 == "WMATIC") {
          // console.log("157", symbol_0);
          //WMATIC-USDT인 경우 ETH-USDT로 변환해주어야 함
          pair_0 = "MATICUSDT";
        } else {
          pair_0 = symbol_0 + "USDT";
        }
        setDecimal0(Number(decimal_0));

        if (!abiMainnetToken[token1]) {
          //abi DB에 없는 경우 이더스캔으로 abi 가져와서 컨트랙트 구성
          const contract_url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${token1}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
          const contract_response = await fetch(contract_url);
          var { result } = await contract_response.json();
          const contract_abi = result[0].ABI;
          contract_1 = new ethers.Contract(token1, contract_abi, provider);
        } else {
          contract_1 = new ethers.Contract(
            token1,
            abiMainnetToken[token1],
            provider
          );
        }
        const decimal_1 = await contract_1.decimals();
        var symbol_1 = await contract_1.symbol();
        setSymbol1(symbol_1);
        var reserve_1 = await contract_1.balanceOf(v3PoolAddress);
        reserve_1 = Number(reserve_1 / 10 ** decimal_1);
        setReserve1(reserve_1);

        if (symbol_1 == "WETH") {
          //WETH-USDT인 경우 ETH-USDT로 변환해주어야 함
          pair_1 = "ETHUSDT";
        } else if (symbol_1 == "WMATIC") {
          // console.log("190", symbol_1);
          //WMATIC-USDT인 경우 ETH-USDT로 변환해주어야 함
          pair_1 = "MATICUSDT";
        } else {
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
      }, time * 500); //  setTimeout(async () => { }, time * 100);
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
      setTimeout(async () => {
        if (!v3PoolContract || lpDollarValue) return;

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

      if (currentTick >= tickLower && currentTick <= tickUpper) {
        setIsInRange(true);
      } else {
        setIsInRange(false);
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
      if (!lpDollarValue || apy == 0) return;
      if (addedTotal == false) {
        var total =
          Number(totalValue) + Number(lpDollarValue) + Number(feeDollarValue);
        setTotalValue(total);
        // console.log("592 total", total);
        // console.log("592 totalvalue", totalValue);
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
    if (!provider || liquidity == 0 || !v3PoolAddress) return;
    getPairTokensInfo();
  }, [provider, v3PoolAddress]);

  useEffect(() => {
    if (!sqrtPriceX96 || !provider) return;
    getTickAtSqrtPrice();
  }, [sqrtPriceX96]);

  useEffect(() => {
    if (!currentTick || !provider) return;
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
    if (!v3PoolContract || !sqrtPriceX96 || !provider || lpDollarValue) return;
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
    if (!price0 || !price1 || !provider) return;
    getDollarValue();
  }, [token1Amount, uncollectedFees1, price1]);

  useEffect(() => {
    if (!lpDollarValue || addedTotal || !provider) return;
    addTotal();
  }, [lpDollarValue]);

  return (
    <>
      {lpDollarValue > 0 && isNaN(apy) == false ? (
        <div className="lp-card mx-auto rounded-3xl w-11/12 h-fit pb-6 mt-4 mb-10 flex flex-col gap-2">
          {/* 헤더 */}
          <div className="dm-sans-defi flex flex-row justify-between items-center m-4">
            {/* 카드이름 */}
            <div className="flex flex-col items-start">
              <div>Uniswap V3</div>
              <div className="text-sm flex">
                TOKENID #{tokenId}
                <a
                  href={`https://app.uniswap.org/pools/${tokenId}`}
                  target="_blank"
                  className="ml-2"
                >
                  <FaExternalLinkAlt />
                </a>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {/* 수익률 */}
              {isInRange ? (
                <>
                  <div className="text-sm text-green-500">IN RANGE</div>
                  <div className="text-green-500">{`+%${(
                    (apy * apyConstant) /
                    365
                  ).toFixed(4)}`}</div>
                </>
              ) : (
                <>
                  <div className="text-sm text-red-500">OUT OF RANGE</div>
                  <div className="text-red-500">{`+%${(
                    (apy * apyConstant) /
                    365
                  ).toFixed(4)}`}</div>
                </>
              )}

              {/* 수익률 기간토글 */}
              <div className="flex flex-row gap-1 items-center text-xs ">
                <div className="flex flex-row gap-1 rounded-md">
                  <button
                    onClick={() => setApyConstant(1)}
                    className={
                      apyConstant == 1
                        ? `apy-toggle-active`
                        : `apy-toggle-inactive`
                    }
                  >
                    D
                  </button>
                  <button
                    onClick={() => setApyConstant(7)}
                    className={
                      apyConstant == 7
                        ? `apy-toggle-active`
                        : `apy-toggle-inactive`
                    }
                  >
                    W
                  </button>
                  <button
                    onClick={() => setApyConstant(30)}
                    className={
                      apyConstant == 30
                        ? `apy-toggle-active`
                        : `apy-toggle-inactive`
                    }
                  >
                    M
                  </button>
                  <button
                    onClick={() => setApyConstant(365)}
                    className={
                      apyConstant == 365
                        ? `apy-toggle-active`
                        : `apy-toggle-inactive`
                    }
                  >
                    Y
                  </button>
                </div>
                <span className="info-btn text-base">ⓘ</span>
              </div>
            </div>
          </div>
          {/* 바디 */}
          <div className="pb-5">
            {/* 구분 */}
            <div className="dm-sans-defi-info flex flex-row justify-between mx-4 pb-2">
              <div>
                {" "}
                Pair Amount
                <a
                  href={`https://app.uniswap.org/explore/pools/ethereum/${v3PoolAddress}`}
                  target="_blank"
                  className="ml-2"
                >
                  <span className="info-btn"> ⓘ</span>
                </a>
              </div>
              <div>USD Value</div>
            </div>
            {/* 제공한 페어 */}
            <div className="dm-sans-defi-info-light flex flex-row justify-between items-center mx-4">
              <div className="flex flex-col justify-center">
                <div className="dm-sans-defi-info-numbers text-md">
                  {/* {LPTokenName}: {_pairname} */}
                  {/* {LPTokenName} */}
                  {`${Number(token0Amount).toFixed(4)} ${symbol0}`}
                </div>
                <div className="dm-sans-defi-info-numbers text-md">
                  {/* {LPTokenName}: {_pairname} */}
                  {/* {_pairname} */}
                  {`${Number(token1Amount).toFixed(4)} ${symbol1}`}
                </div>
              </div>
              <div>
                {/* <div>{userLpValue}</div> */}
                <div className="dm-sans-defi-info-numbers text-2xl">
                  {`$${Number(lpDollarValue).toFixed(4)}`}
                </div>
              </div>
            </div>
            {/* 보상 */}
            <div className="pt-6">
              <div className="dm-sans-defi-info flex flex-row justify-between mx-4 pb-2">
                <div>
                  REWARD AMOUNT <span className="info-btn">ⓘ</span>
                </div>
                <div>USD Value</div>
              </div>
              <div className="dm-sans-defi-info-light flex flex-row justify-between items-center mx-4">
                <div className="flex flex-col justify-center">
                  <div className="dm-sans-defi-info-numbers text-md">
                    {/* {LPTokenName}: {_pairname} */}
                    {/* {LPTokenName} */}
                    {`${Number(uncollectedFees0).toFixed(4)} ${symbol0}`}
                  </div>
                  <div className="dm-sans-defi-info-numbers text-md">
                    {/* {LPTokenName}: {_pairname} */}
                    {/* {_pairname} */}
                    {`${Number(uncollectedFees1).toFixed(4)} ${symbol1}`}
                  </div>
                </div>
                <div>
                  {/* <div>{userLpValue}</div> */}
                  <div className="dm-sans-defi-info-numbers text-2xl">
                    {`$${Number(feeDollarValue).toFixed(4)}`}
                  </div>
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

export default LpPoolCardUniswapV3;
