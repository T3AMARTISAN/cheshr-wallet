import { useEffect, useState } from "react";
import LpPoolCard from "./LpPoolCard";
import lpContractDbMainnet from "../utils/lpV2Mainnet.json";
import { useOutletContext } from "react-router-dom";
import LPPoolCardUniswapV3 from "./LpPoolCardUniswapV3";
import { ethers } from "ethers";

import { UniswapV3 } from "../utils/uniswapV3FactoryContract";
import LpPoolCardUniswapV3Polygon from "./LpPoolCardUniswapV3Polygon";
import LpPoolCardUniswapV3Optimism from "./LpPoolCardUniswapV3Optimism";

// @TODO

//사용자가 보유한 LP 토큰을 보여주는 화면
const DeFi = () => {
  const {
    lpV2Array,
    setLpV2Array,
    currentAccount,
    setCurrentAccount,
    currentProvider,
    currentNetwork,
    addedLps,
    importOpen,
  } = useOutletContext(); //테스트->실제로 변경  시  setCurrentAccount useEffect 제거하면 됨

  const [lpV3Array, setLpV3Array] = useState();
  const [lpV3ArrayPolygon, setLpV3ArrayPolygon] = useState();
  const [lpV3ArrayOptimism, setLpV3ArrayOptimism] = useState();
  const [totalValue, setTotalValue] = useState(0);
  const [
    nonFungiblePositionManagerContract,
    setNonFungiblePositionManagerContract,
  ] = useState();
  const [provider, setProvider] = useState();

  const getProvider = () => {
    console.log("32 new provider");
    setTotalValue(0);
    setLpV2Array([]);
    setLpV3Array([]);
    setLpV3ArrayPolygon([]);
    setLpV3ArrayOptimism([]);
    if (currentNetwork == "Ethereum") {
      setProvider(new ethers.providers.InfuraProvider());
    } else if (currentNetwork == "Polygon") {
      setProvider(
        new ethers.providers.InfuraProvider(
          "matic",
          process.env.INFURA_API_KEY_DEFI
        )
      );
    } else if (currentNetwork == "Optimism") {
      setProvider(
        new ethers.providers.InfuraProvider(
          "optimism",
          process.env.INFURA_API_KEY_DEFI
        )
      );
    }
  };

  useEffect(() => {
    getProvider();
  }, [currentProvider]);

  //v3 manager contract 구성
  const getPositionManager = () => {
    if (!provider) return;

    const nonFungiblePositionManagerContractAddress =
      UniswapV3.nfPositionManagerAddress;
    const nonFungiblePositionManagerContractAbi =
      UniswapV3.nfPositionManagerAbi;

    const contract = new ethers.Contract(
      nonFungiblePositionManagerContractAddress,
      nonFungiblePositionManagerContractAbi,
      provider
    );
    setNonFungiblePositionManagerContract(contract);
  };

  //보유한 모든 v3 풀을 어레이에 담기
  const getMyV3Lps = async () => {
    try {
      setTimeout(async () => {
        const tokenCount = await nonFungiblePositionManagerContract.balanceOf(
          "0x524b7c9b4ca33ba72445dfd2d6404c81d8d1f2e3"
        );
        var tempId = [];
        for (let i = 0; i < tokenCount; i++) {
          const id =
            await nonFungiblePositionManagerContract.tokenOfOwnerByIndex(
              "0x524b7c9b4ca33ba72445dfd2d6404c81d8d1f2e3", // 여기를 currentAccount로 바꿔주면 테스트계정 말고 실제 계정으로 작동
              i
            );

          const position = await nonFungiblePositionManagerContract.positions(
            id
          );

          const unwrappedPosition = {
            tokenId: id.toString(),
            nonce: position.nonce.toString(),
            operator: position.operator,
            token0: position.token0.toLowerCase(),
            token1: position.token1.toLowerCase(),
            fee: position.fee.toString(),
            tickLower: position.tickLower.toString(),
            tickUpper: position.tickUpper.toString(),
            liquidity: position.liquidity.toString(),
            feeGrowthInside0LastX128:
              position.feeGrowthInside0LastX128.toString(),
            feeGrowthInside1LastX128:
              position.feeGrowthInside1LastX128.toString(),
            tokensOwed0: position.tokensOwed0.toString(),
            tokensOwed1: position.tokensOwed1.toString(),
          };
          tempId.push(unwrappedPosition);
        }

        if (currentNetwork == "Ethereum") {
          setLpV3Array(tempId);
        } else if (currentNetwork == "Polygon") {
          setLpV3ArrayPolygon(tempId);
        } else if (currentNetwork == "Optimism") {
          setLpV3ArrayOptimism(tempId);
        }

        // console.log(tempId);
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!provider) {
      return;
    }
    getPositionManager();
  }, [provider]);

  useEffect(() => {
    if (!nonFungiblePositionManagerContract) {
      return;
    }
    getMyV3Lps();
  }, [nonFungiblePositionManagerContract]);

  //무한스크롤, 한 번에 모든 카드 불러오지 않고, 몇 개씩 불러오도록
  //LP.json에 저장되어 있는 컨트랙트+로컬 스토리지에 저장된 컨트랙트를 결합해 보여줄 전체 lp 컨트랙트의 리스트 lpArray를 구성한다.
  const getMyV2Lps = () => {
    // if (!currentAccount) return;
    if (currentNetwork != "Ethereum") return;
    // if (addLpButtonIsClicked != 0) return;
    console.log("156 getv2lps entered function");
    //모든 lp 담아줄 임시 배열
    var temp = [];

    //json에 있는 주소 넣기
    temp = lpContractDbMainnet;

    //로컬에서 추가한 lp 받아와 temp에 저장
    const localLps = localStorage.getItem("addedLps");

    //로컬에 따로 저장된 게 없을 때에는 json 파일에 있는 주소만으로 lpArray 구성
    if (!localLps) {
      console.log("166 no local");
      setLpV2Array(temp);
      return;
    }

    //로컬에 저장된 게 있는 경우 불러와서 Lp.json과 합쳐서 lpArray 구성
    const parsedLps = JSON.parse(localLps);
    console.log("165 get local lp", parsedLps);
    // setAddedLps(parsedLps);
    temp = [...temp, ...parsedLps];

    setLpV2Array(temp);
    console.log("179", lpV2Array);
  };

  // //테스트 시 테스트 지갑 주소 하드코딩 부분. 테스트 ->실제 변경 시 유즈이펙트 제거해주면 됨
  // useEffect(() => {
  //   setCurrentAccount(process.env.REACT_APP_TEST_ACCOUNT);
  // }, []);

  //로컬에 lp가 추가되거나(AddLpModal.jsx에서) 계정에 로그인되었을 때 useEffect로 전체 lpArray 배열을 업데이트해준다.
  useEffect(() => {
    console.log("187 getv2lps useeffect entered");
    if (importOpen == true) return;
    if (currentNetwork != "Ethereum") return;
    if (!provider) return;
    getMyV2Lps();
    console.log("191 getv2lps useeffect done");
  }, [provider, importOpen]);
  return (
    <div className="container-dashboard dashboard-feed-bg relative flex flex-col">
      <div className="flex flex-row justify-between items-center py-4 mx-8">
        <div className="dm-sans font-medium text-xl text-white">DeFi</div>
        <div className="dm-sans font-base text-purple-50 flex flex-col justify-center items-center">
          <div className="text-xs text-purple-100">Total Value:</div>
          <div className="text-2xl"> ${totalValue.toFixed(2)}</div>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        {/* lpArray 하나씩 조회해 각 lp 토큰 카드로 뿌려줌. 잔고 있는지 유무는 LpPoolCard 컴포넌트에서 판단 */}
        {currentNetwork == "Ethereum" && provider
          ? lpV2Array?.map((v, i) => (
              <LpPoolCard
                _lpContractAddress={v.address}
                _lpAbi={v.abi}
                _pairname={v.name}
                key={i}
                time={i}
                totalValue={totalValue}
                setTotalValue={setTotalValue}
                provider={provider}
              />
            ))
          : ""}
        {currentNetwork == "Ethereum"
          ? lpV3Array?.map((v, i) => (
              <LPPoolCardUniswapV3
                key={i}
                time={i}
                tokenId={v.tokenId}
                fee={v.fee}
                feeGrowthInside0LastX128={v.feeGrowthInside0LastX128}
                feeGrowthInside1LastX128={v.feeGrowthInside1LastX128}
                liquidity={v.liquidity}
                tickLower={v.tickLower}
                tickUpper={v.tickUpper}
                token0={v.token0.toLowerCase()}
                token1={v.token1.toLowerCase()}
                totalValue={totalValue}
                setTotalValue={setTotalValue}
                provider={provider}
              />
            ))
          : ""}
        {currentNetwork == "Polygon"
          ? lpV3ArrayPolygon?.map((v, i) => (
              <LpPoolCardUniswapV3Polygon
                key={i}
                time={i}
                tokenId={v.tokenId}
                fee={v.fee}
                feeGrowthInside0LastX128={v.feeGrowthInside0LastX128}
                feeGrowthInside1LastX128={v.feeGrowthInside1LastX128}
                liquidity={v.liquidity}
                tickLower={v.tickLower}
                tickUpper={v.tickUpper}
                token0={v.token0.toLowerCase()}
                token1={v.token1.toLowerCase()}
                totalValue={totalValue}
                setTotalValue={setTotalValue}
                lpV3Array={lpV3Array}
                provider={provider}
              />
            ))
          : ""}
        {currentNetwork == "Optimism"
          ? lpV3ArrayOptimism?.map((v, i) => (
              <LpPoolCardUniswapV3Optimism
                key={i}
                time={i}
                tokenId={v.tokenId}
                fee={v.fee}
                feeGrowthInside0LastX128={v.feeGrowthInside0LastX128}
                feeGrowthInside1LastX128={v.feeGrowthInside1LastX128}
                liquidity={v.liquidity}
                tickLower={v.tickLower}
                tickUpper={v.tickUpper}
                token0={v.token0.toLowerCase()}
                token1={v.token1.toLowerCase()}
                totalValue={totalValue}
                setTotalValue={setTotalValue}
                lpV3Array={lpV3Array}
                provider={provider}
              />
            ))
          : ""}
        {/* 모달창
        {addLpButtonIsClicked > 0 && (
          <AddLpModal
            addLpButtonIsClicked={addLpButtonIsClicked}
            setAddLpButtonIsClicked={setAddLpButtonIsClicked}
            addedLps={addedLps}
            setAddedLps={setAddedLps}
            lpArray={lpArray}
          />
        )}        */}
        {/* lp 토큰 추가하기 버튼, 누르면 AddLpModal 모달창이 나온다 */}
        {/* <div className="absolute bottom-4 right-4">
          <button
            className="bg-green-300  w-16 h-16 rounded-full"
            onClick={() => setAddLpButtonIsClicked(1)}
          >
            +
          </button>
        </div>{" "} */}
      </div>
      {/* <div className="sticky bottom-2 text-right bg-green-200 m-2 px-auto dm-sans-token">
        TOTAL VALUE: ${totalValue.toFixed(2)}
      </div> */}
    </div>
  );
};

export default DeFi;
