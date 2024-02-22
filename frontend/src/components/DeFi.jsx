import { useEffect, useState } from "react";
import LpPoolCard from "./LpPoolCard";
import AddLpModal from "./AddLpModal";
import lpContractDb from "../utils/LP.json";
import { useOutletContext } from "react-router-dom";
import LPPoolCardUniswapV3 from "./LpPoolCardUniswapV3";
import { ethers } from "ethers";

// @TODO

//사용자가 보유한 LP 토큰을 보여주는 화면
const DeFi = () => {
  const { currentAccount, setCurrentAccount, currentProvider } =
    useOutletContext(); //테스트->실제로 변경  시  setCurrentAccount useEffect 제거하면 됨
  const [lpArray, setLpArray] = useState(); //사용자의 lp 잔고 조회할 모든 컨트랙트 주소 담은 배열 (여기에 LP.json과 로컬 json 담아준다)
  const [addLpButtonIsClicked, setAddLpButtonIsClicked] = useState(0); //모달창 화면 관리 상태변수
  const [addedLps, setAddedLps] = useState([]); //로컬에 저장된 LP의 목록을 리액트로 불러와 관리(추가)하기 위한 상태변수
  const [lpV3Array, setLpV3Array] = useState();
  const [totalValue, setTotalValue] = useState(0);
  //v3

  //Defi로 옮겨야  함
  const [
    nonFungiblePositionManagerContract,
    setNonFungiblePositionManagerContract,
  ] = useState();

  //Defi로 옮겨야  함
  const nonFungiblePositionManagerContractAddress =
    "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
  const nonFungiblePositionManagerContractAbi = [
    {
      inputs: [
        { internalType: "address", name: "_factory", type: "address" },
        { internalType: "address", name: "_WETH9", type: "address" },
        { internalType: "address", name: "_tokenDescriptor_", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount0",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount1",
          type: "uint256",
        },
      ],
      name: "Collect",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint128",
          name: "liquidity",
          type: "uint128",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount0",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount1",
          type: "uint256",
        },
      ],
      name: "DecreaseLiquidity",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint128",
          name: "liquidity",
          type: "uint128",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount0",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount1",
          type: "uint256",
        },
      ],
      name: "IncreaseLiquidity",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "DOMAIN_SEPARATOR",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PERMIT_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "WETH9",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "baseURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint128", name: "amount0Max", type: "uint128" },
            { internalType: "uint128", name: "amount1Max", type: "uint128" },
          ],
          internalType: "struct INonfungiblePositionManager.CollectParams",
          name: "params",
          type: "tuple",
        },
      ],
      name: "collect",
      outputs: [
        { internalType: "uint256", name: "amount0", type: "uint256" },
        { internalType: "uint256", name: "amount1", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token0", type: "address" },
        { internalType: "address", name: "token1", type: "address" },
        { internalType: "uint24", name: "fee", type: "uint24" },
        { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
      ],
      name: "createAndInitializePoolIfNecessary",
      outputs: [{ internalType: "address", name: "pool", type: "address" }],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "uint128", name: "liquidity", type: "uint128" },
            { internalType: "uint256", name: "amount0Min", type: "uint256" },
            { internalType: "uint256", name: "amount1Min", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
          ],
          internalType:
            "struct INonfungiblePositionManager.DecreaseLiquidityParams",
          name: "params",
          type: "tuple",
        },
      ],
      name: "decreaseLiquidity",
      outputs: [
        { internalType: "uint256", name: "amount0", type: "uint256" },
        { internalType: "uint256", name: "amount1", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "factory",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "getApproved",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            {
              internalType: "uint256",
              name: "amount0Desired",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount1Desired",
              type: "uint256",
            },
            { internalType: "uint256", name: "amount0Min", type: "uint256" },
            { internalType: "uint256", name: "amount1Min", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
          ],
          internalType:
            "struct INonfungiblePositionManager.IncreaseLiquidityParams",
          name: "params",
          type: "tuple",
        },
      ],
      name: "increaseLiquidity",
      outputs: [
        { internalType: "uint128", name: "liquidity", type: "uint128" },
        { internalType: "uint256", name: "amount0", type: "uint256" },
        { internalType: "uint256", name: "amount1", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            { internalType: "address", name: "token0", type: "address" },
            { internalType: "address", name: "token1", type: "address" },
            { internalType: "uint24", name: "fee", type: "uint24" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
            {
              internalType: "uint256",
              name: "amount0Desired",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "amount1Desired",
              type: "uint256",
            },
            { internalType: "uint256", name: "amount0Min", type: "uint256" },
            { internalType: "uint256", name: "amount1Min", type: "uint256" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
          ],
          internalType: "struct INonfungiblePositionManager.MintParams",
          name: "params",
          type: "tuple",
        },
      ],
      name: "mint",
      outputs: [
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint128", name: "liquidity", type: "uint128" },
        { internalType: "uint256", name: "amount0", type: "uint256" },
        { internalType: "uint256", name: "amount1", type: "uint256" },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes[]", name: "data", type: "bytes[]" }],
      name: "multicall",
      outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "ownerOf",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "permit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "positions",
      outputs: [
        { internalType: "uint96", name: "nonce", type: "uint96" },
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "address", name: "token0", type: "address" },
        { internalType: "address", name: "token1", type: "address" },
        { internalType: "uint24", name: "fee", type: "uint24" },
        { internalType: "int24", name: "tickLower", type: "int24" },
        { internalType: "int24", name: "tickUpper", type: "int24" },
        { internalType: "uint128", name: "liquidity", type: "uint128" },
        {
          internalType: "uint256",
          name: "feeGrowthInside0LastX128",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "feeGrowthInside1LastX128",
          type: "uint256",
        },
        { internalType: "uint128", name: "tokensOwed0", type: "uint128" },
        { internalType: "uint128", name: "tokensOwed1", type: "uint128" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "refundETH",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "bytes", name: "_data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "selfPermit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "nonce", type: "uint256" },
        { internalType: "uint256", name: "expiry", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "selfPermitAllowed",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "nonce", type: "uint256" },
        { internalType: "uint256", name: "expiry", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "selfPermitAllowedIfNecessary",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "selfPermitIfNecessary",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "amountMinimum", type: "uint256" },
        { internalType: "address", name: "recipient", type: "address" },
      ],
      name: "sweepToken",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
      name: "tokenByIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "uint256", name: "index", type: "uint256" },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "tokenURI",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "amount0Owed", type: "uint256" },
        { internalType: "uint256", name: "amount1Owed", type: "uint256" },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "uniswapV3MintCallback",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "amountMinimum", type: "uint256" },
        { internalType: "address", name: "recipient", type: "address" },
      ],
      name: "unwrapWETH9",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    { stateMutability: "payable", type: "receive" },
  ];

  //Defi로 옮겨야  함
  const getPositionManager = () => {
    const contract = new ethers.Contract(
      nonFungiblePositionManagerContractAddress,
      nonFungiblePositionManagerContractAbi,
      currentProvider
    );

    setNonFungiblePositionManagerContract(contract);
    console.log(nonFungiblePositionManagerContract);
  };

  //Defi로 옮겨야  함
  const getMyTokenIDs = async () => {
    try {
      const tokenCount = await nonFungiblePositionManagerContract.balanceOf(
        process.env.REACT_APP_TEST_ACCOUNT
      );
      var tempId = [];
      for (let i = 0; i < tokenCount; i++) {
        const id = await nonFungiblePositionManagerContract.tokenOfOwnerByIndex(
          process.env.REACT_APP_TEST_ACCOUNT, // 여기를 currentAccount로 바꿔주면 테스트계정 말고 실제 계정으로 작동
          i
        );

        const position = await nonFungiblePositionManagerContract.positions(id);
        const unwrappedPosition = {
          tokenId: id.toString(),
          nonce: position.nonce.toString(),
          operator: position.operator,
          token0: position.token0,
          token1: position.token1,
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
      setLpV3Array(tempId);
      // console.log(tempId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentProvider) {
      return;
    }
    getPositionManager();
  }, [currentProvider]);

  useEffect(() => {
    if (!nonFungiblePositionManagerContract) {
      return;
    }
    getMyTokenIDs();
  }, [nonFungiblePositionManagerContract]);

  useEffect(() => {
    if (!lpV3Array) return;

    // console.log(lpV3Array);
  }, [lpV3Array]);

  //무한스크롤, 한 번에 모든 카드 불러오지 않고, 몇 개씩 불러오도록
  //LP.json에 저장되어 있는 컨트랙트+로컬 스토리지에 저장된 컨트랙트를 결합해 보여줄 전체 lp 컨트랙트의 리스트 lpArray를 구성한다.
  const getMyLps = () => {
    if (!currentAccount) return;

    //모든 lp 담아줄 임시 배열
    var temp = [];

    //json에 있는 주소 넣기
    temp = lpContractDb;

    //로컬에서 추가한 lp 받아와 temp에 저장
    const localLps = localStorage.getItem("addedLps");

    //로컬에 따로 저장된 게 없을 때에는 json 파일에 있는 주소만으로 lpArray 구성
    if (!localLps) {
      setLpArray(temp);
      return;
    }

    //로컬에 저장된 게 있는 경우 불러와서 Lp.json과 합쳐서 lpArray 구성
    const parsedLps = JSON.parse(localLps);
    setAddedLps(parsedLps);
    temp = [...temp, ...parsedLps];

    setLpArray(temp);
  };

  // //테스트 시 테스트 지갑 주소 하드코딩 부분. 테스트 ->실제 변경 시 유즈이펙트 제거해주면 됨
  // useEffect(() => {
  //   setCurrentAccount(process.env.REACT_APP_TEST_ACCOUNT);
  // }, []);

  //로컬에 lp가 추가되거나(AddLpModal.jsx에서) 계정에 로그인되었을 때 useEffect로 전체 lpArray 배열을 업데이트해준다.
  useEffect(() => {
    if (addLpButtonIsClicked != 0) return;
    getMyLps();
  }, [addLpButtonIsClicked]);
  return (
    <div className="container-dashboard dashboard-bg border-t-0 relative flex flex-col">
      <div className="flex-grow overflow-auto">
        {/* lpArray 하나씩 조회해 각 lp 토큰 카드로 뿌려줌. 잔고 있는지 유무는 LpPoolCard 컴포넌트에서 판단 */}
        {lpArray?.map((v, i) => (
          <LpPoolCard
            _lpContractAddress={v.address}
            _lpAbi={v.abi}
            _pairname={v.name}
            key={i}
            totalValue={totalValue}
            setTotalValue={setTotalValue}
          />
        ))}

        {lpV3Array?.map((v, i) => (
          <LPPoolCardUniswapV3
            key={i}
            time={i}
            tokenId={v.tokenId}
            fee={v.fee}
            feeGrowthInside0LastX128={v.feeGrowthInside0LastX128}
            feeGrowthInside1LastX128={v.feeGrowthInside1LastX128}
            liquidity={v.liquidity}
            nonce={v.nonce}
            operator={v.operator}
            tickLower={v.tickLower}
            tickUpper={v.tickUpper}
            token0={v.token0.toLowerCase()}
            token1={v.token1.toLowerCase()}
            tokensOwed0={v.tokensOwed0}
            tokensOwed1={v.tokensOwed1}
            totalValue={totalValue}
            setTotalValue={setTotalValue}
          />
        ))}

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
      <div className="sticky bottom-2 text-right bg-green-200 m-2 px-auto dm-sans-token">
        TOTAL VALUE: ${totalValue.toFixed(2)}
      </div>
    </div>
  );
};

export default DeFi;
