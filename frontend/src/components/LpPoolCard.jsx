import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { abiMainnetToken } from "../utils/abiToken.js";

const LPPoolCard = ({
  _lpContractAddress,
  _lpAbi,
  _pairname,
  totalValue,
  setTotalValue,
  provider,
  time,
}) => {
  const { currentProvider, currentAccount } = useOutletContext();

  const [lpContract, setLpContract] = useState();
  const [LPTokenAmount, setLPTokenAmount] = useState();
  const [totalLpSupply, setTotalLpSupply] = useState();
  const [symbol0, setSymbol0] = useState();
  const [symbol1, setSymbol1] = useState();
  const [reserve0, setReserve0] = useState();
  const [reserve1, setReserve1] = useState();
  const [decimal0, setDecimal0] = useState();
  const [decimal1, setDecimal1] = useState();
  const [price0, setPrice0] = useState();
  const [price1, setPrice1] = useState();
  const [tvl, setTvl] = useState();
  const [userLpValue, setUserLpValue] = useState();
  const [addedTotal, setAddedTotal] = useState(false);

  //하나의 LP 컨트랙트 주소를 받았을 때 lpCard의 contract 객체 설정
  const setLpCA = async () => {
    try {
      setTimeout(async () => {
        console.log("35");
        if (!provider) return;
        console.log("37", _pairname);
        const contract = new ethers.Contract(
          _lpContractAddress,
          _lpAbi,
          provider
        );
        setLpContract(contract);
      }, time * 100);
    } catch (error) {
      console.log(error);
    }
  };

  //사용자가 보유한 LP 토큰 수
  const getUserLpAmount = async () => {
    try {
      if (!lpContract || userLpValue) return;
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

  //두 페어의 decimal, symbol 정보 가져오기
  const getPairInfo = async () => {
    try {
      if (!lpContract || LPTokenAmount == 0 || !totalLpSupply) return;

      //lp Contract의 token0, token1이 어떤 토큰인지 저장
      var token0 = await lpContract.token0();
      token0 = token0.toLowerCase();
      var token1 = await lpContract.token1();
      token1 = token1.toLowerCase();

      if (abiMainnetToken[token0] == "") {
        //abi DB에 없는 경우 이더스캔으로 abi 가져와서 컨트랙트 구성
        const contract_url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
        const contract_response = await fetch(contract_url);
        var { result } = await contract_response.json();
        const contract_abi = result[0].ABI;
        const contract_0 = new ethers.Contract(token0, contract_abi, provider);
      } else {
        //js 파일에 저장된 abi로 컨트랙트 구성(provider 사용 줄이기 위해)
        const contract_0 = new ethers.Contract(
          token0,
          abiMainnetToken[token0],
          provider
        );
        //decimal0, symbol0 호출
        const decimal_0 = await contract_0.decimals(); //bigint
        var symbol_0 = await contract_0.symbol();
        setSymbol0(symbol_0);
        setDecimal0(Number(decimal_0));
      }

      if (abiMainnetToken[token1] == "") {
        //abi DB에 없는 경우 이더스캔으로 abi 가져와서 컨트랙트 구성
        const contract_url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${token1}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
        const contract_response = await fetch(contract_url);
        var { result } = await contract_response.json();
        const contract_abi = result[0].ABI;
        const contract_1 = new ethers.Contract(token1, contract_abi, provider);
      } else {
        const contract_1 = await new ethers.Contract(
          token1,
          abiMainnetToken[token1],
          provider
        );
        const decimal_1 = await contract_1.decimals();
        var symbol_1 = await contract_1.symbol();
        setSymbol1(symbol_1);
        setDecimal1(Number(decimal_1));
      }
    } catch (error) {
      console.log(error);
    }
  };

  //각 페어의 수량, lp의 토큰별 reserve 구하기
  const getAmount = async () => {
    try {
      const reserve = await lpContract.getReserves();
      var reserve0 = Number(reserve[0]) / 10 ** decimal0;
      var reserve1 = Number(reserve[1]) / 10 ** decimal1;
      setReserve0(reserve0);
      setReserve1(reserve1);
    } catch (error) {
      console.log(error);
    }
  };

  //두 페어의 바이낸스 시세 가져오기
  const getPrice = async () => {
    try {
      if (!LPTokenAmount || LPTokenAmount == 0 || !symbol1) return;

      var symbol_0 = symbol0.toUpperCase();
      if (symbol_0 == "WETH") {
        //WETH-USDT인 경우 ETH-USDT로 변환해주어야 함
        var pair_0 = "ETHUSDT";
      } else {
        var pair_0 = symbol_0 + "USDT";
      }

      var symbol_1 = symbol1.toUpperCase();

      if (symbol_1 == "WETH") {
        //WETH-USDT인 경우 ETH-USDT로 변환해주어야 함
        var pair_1 = "ETHUSDT";
      } else {
        var pair_1 = symbol_1 + "USDT";
      }

      //binance 시세 불러오기
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
        setPrice1(price1);
      } else {
        setPrice1(1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //tvl 계산
  const getTvl = async () => {
    try {
      if (!price0 || !price1) return;
      if ((reserve0 == 0 && reserve1 == 0) || !reserve0 || !reserve1) return;

      var tvl = reserve0 * price0 + reserve1 * price1;
      setTvl(tvl);
    } catch (error) {
      console.log(error);
    }
  };

  //최종적으로 사용자가 보유한 LP풀 지분의 달러 가치 구하기
  const getLpValue = async () => {
    try {
      if (!tvl || !LPTokenAmount || !totalLpSupply) return;
      var userLpValue = tvl * (LPTokenAmount / totalLpSupply);
      userLpValue = Number(userLpValue);
      userLpValue = userLpValue.toFixed(4); //소수점 자리수
      setUserLpValue(userLpValue);
    } catch (error) {
      console.log(error);
    }
  };

  //예치금 디파이 총합에 더하기
  const addTotal = async () => {
    try {
      if (!userLpValue) return;
      console.log("224 add total");
      if (addedTotal == false) {
        var total = Number(totalValue) + Number(userLpValue);
        console.log("227", total);
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
    if (!provider) {
      return;
    }
    setLpCA();
    // pepe-eth : 0xa43fe16908251ee70ef74718545e4fe6c5ccec9f
    // weth-usdt: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"
  }, [provider]);

  useEffect(() => {
    if (!lpContract || userLpValue) {
      return;
    }
    getUserLpAmount();
  }, [lpContract]);

  useEffect(() => {
    if (!lpContract || LPTokenAmount == 0 || userLpValue) {
      return;
    }
    getTotalLpSupply();
  }, [LPTokenAmount]);

  useEffect(() => {
    if (
      !lpContract ||
      !LPTokenAmount ||
      !totalLpSupply ||
      LPTokenAmount == 0 ||
      userLpValue
    )
      return;
    getPairInfo();
  }, [LPTokenAmount, totalLpSupply]);

  useEffect(() => {
    if (!symbol1 || LPTokenAmount == 0 || !LPTokenAmount || userLpValue) return;
    getPrice();
  }, [symbol1, LPTokenAmount]);

  useEffect(() => {
    if (
      LPTokenAmount == 0 ||
      !LPTokenAmount ||
      !totalLpSupply ||
      !decimal1 ||
      userLpValue
    )
      return;
    getAmount();
  }, [LPTokenAmount, totalLpSupply, decimal1]);

  useEffect(() => {
    if (
      !price0 ||
      !price1 ||
      LPTokenAmount == 0 ||
      !LPTokenAmount ||
      userLpValue
    )
      return;
    if ((reserve0 == 0 && reserve1 == 0) || !reserve0 || !reserve1) return;
    getTvl();
  }, [price1, reserve1]);

  useEffect(() => {
    if (
      !tvl ||
      LPTokenAmount == 0 ||
      !totalLpSupply ||
      !LPTokenAmount ||
      userLpValue
    ) {
      return;
    }
    getLpValue();
  }, [tvl]);

  useEffect(() => {
    if (!userLpValue) return;
    addTotal();
  }, [userLpValue]);

  return (
    <>
      {userLpValue ? (
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
                  {(reserve0 * (LPTokenAmount / totalLpSupply)).toFixed(6)}{" "}
                  {symbol0}
                </div>
                <div className="m-sans-body-reveal">
                  {(reserve1 * (LPTokenAmount / totalLpSupply)).toFixed(6)}{" "}
                  {symbol1}
                </div>
              </div>
              <div>
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
