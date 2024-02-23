import { useOutletContext } from "react-router-dom";
import TokenCard from "./TokenCard";
import { ethers } from "ethers";
import {
  ETH_TOKEN_ADDRESS,
  POLYGON_TOKEN_ADDRESS,
  ARBITRUM_TOKEN_ADDRESS,
  OPTIMISM_TOKEN_ADDRESS,
} from "../tokenContracts/tokenAddress";
import { useEffect, useState } from "react";

const tokenAddress = [
  {
    name: "SAND",
    address: "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_childChainManagerProxy",
            type: "address",
          },
          {
            internalType: "address",
            name: "trustedForwarder",
            type: "address",
          },
          { internalType: "address", name: "sandAdmin", type: "address" },
          { internalType: "address", name: "executionAdmin", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "oldAdmin",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "newAdmin",
            type: "address",
          },
        ],
        name: "AdminChanged",
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
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
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
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "superOperator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "enabled",
            type: "bool",
          },
        ],
        name: "SuperOperator",
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
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amountNeeded", type: "uint256" },
        ],
        name: "addAllowanceIfNeeded",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [
          { internalType: "uint256", name: "remaining", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "approveAndCall",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approveFor",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
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
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burnFor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newAdmin", type: "address" },
        ],
        name: "changeAdmin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "childChainManagerProxy",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "bytes", name: "depositData", type: "bytes" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getAdmin",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getTrustedForwarder",
        outputs: [
          {
            internalType: "address",
            name: "trustedForwarder",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "who", type: "address" }],
        name: "isSuperOperator",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "forwarder", type: "address" },
        ],
        name: "isTrustedForwarder",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
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
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "target", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "paidCall",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "superOperator", type: "address" },
          { internalType: "bool", name: "enabled", type: "bool" },
        ],
        name: "setSuperOperator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "trustedForwarder",
            type: "address",
          },
        ],
        name: "setTrustedForwarder",
        outputs: [],
        stateMutability: "nonpayable",
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
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newChildChainManagerProxy",
            type: "address",
          },
        ],
        name: "updateChildChainManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
  {
    name: "WETH",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "childChainManager",
            type: "address",
          },
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
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
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
            indexed: false,
            internalType: "address",
            name: "userAddress",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address payable",
            name: "relayerAddress",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bytes",
            name: "functionSignature",
            type: "bytes",
          },
        ],
        name: "MetaTransactionExecuted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "previousAdminRole",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "bytes32",
            name: "newAdminRole",
            type: "bytes32",
          },
        ],
        name: "RoleAdminChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleGranted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "role",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
        ],
        name: "RoleRevoked",
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
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [],
        name: "CHILD_CHAIN_ID",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "CHILD_CHAIN_ID_BYTES",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "DEPOSITOR_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ERC712_VERSION",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ROOT_CHAIN_ID",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ROOT_CHAIN_ID_BYTES",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "user", type: "address" },
          { internalType: "bytes", name: "depositData", type: "bytes" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "userAddress", type: "address" },
          { internalType: "bytes", name: "functionSignature", type: "bytes" },
          { internalType: "bytes32", name: "sigR", type: "bytes32" },
          { internalType: "bytes32", name: "sigS", type: "bytes32" },
          { internalType: "uint8", name: "sigV", type: "uint8" },
        ],
        name: "executeMetaTransaction",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "getChainId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [],
        name: "getDomainSeperator",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "user", type: "address" }],
        name: "getNonce",
        outputs: [{ internalType: "uint256", name: "nonce", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleAdmin",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes32", name: "role", type: "bytes32" },
          { internalType: "uint256", name: "index", type: "uint256" },
        ],
        name: "getRoleMember",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleMemberCount",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes32", name: "role", type: "bytes32" },
          { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes32", name: "role", type: "bytes32" },
          { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
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
        inputs: [
          { internalType: "bytes32", name: "role", type: "bytes32" },
          { internalType: "address", name: "account", type: "address" },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "bytes32", name: "role", type: "bytes32" },
          { internalType: "address", name: "account", type: "address" },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
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
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
];
const Tokens = () => {
  //const [tokenAddress, setTokenAddress] = useState([]);
  const [balance, setBalance] = useState([]);

  const {
    currentAccount,
    setCurrentAccount,
    /*currentProvider currentNetwork,*/
  } = useOutletContext();

  const findERC20Tokens = async (currentAccount, tokenAddress, ticker) => {
    if (!currentAccount || !tokenAddress || !ticker) return;

    var currentProvider = new ethers.providers.InfuraProvider(
      "matic",
      process.env.REACT_APP_POLYGONSCAN_API_KEY
    );
    const erc20Transfers = [];
    const filter = {
      address: tokenAddress,
      // v6 : topics: [ethers.id("Transfer(address,address,uint256)")],
      // v5
      topics: [ethers.utils.id("Transfer(address,address,uint256)")],
      fromBlock: (await currentProvider.getBlockNumber()) - 100,
      toBlock: await currentProvider.getBlockNumber(),
    };

    const logs = await currentProvider.getLogs(filter);
    for (const log of logs) {
      // v6 : const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      //      const parsedLog = abiCoder.decode(["uint256"], log.data);
      // v5
      const parsedLog = ethers.utils.defaultAbiCoder.decode(
        ["uint256"],
        log.data
      );

      const tokenAddress = log.address;
      const from = "0x" + log.topics[1].substring(26);
      const to = "0x" + log.topics[2].substring(26);
      // v6 : const value = Number(ethers.formatEther(String(parsedLog[0])));
      // v5
      const value = Number(ethers.utils.formatEther(String(parsedLog[0])));
      erc20Transfers.push([{ tokenAddress, from, to, value }]);
    }

    var tokenBalances = 0;
    const addr = currentAccount.toLowerCase();
    for (const transfer of erc20Transfers) {
      if (transfer[0].from === addr) {
        if (tokenBalances === 0) {
          tokenBalances = -transfer[0].value;
        } else {
          tokenBalances -= transfer[0].value;
        }
      }
      if (transfer[0].to === addr) {
        if (tokenBalances === 0) {
          tokenBalances = transfer[0].value;
        } else {
          tokenBalances += transfer[0].value;
        }
      }
    }
    setBalance((prevBalance) => [
      ...prevBalance,
      { ticker: ticker, value: tokenBalances },
    ]);
    //return { ticker: ticker, value: tokenBalances };
  };

  // useEffect(() => {
  /*
    var currentNetwork = "Polygon";
    if (currentNetwork == "Polygon") {
      setTokenAddress(POLYGON_TOKEN_ADDRESS);
    } else if (currentNetwork == "Ethereum") {
      setTokenAddress(ETH_TOKEN_ADDRESS);
    } else if (currentNetwork == "Arbitrum") {
      setTokenAddress(ARBITRUM_TOKEN_ADDRESS);
    } else if (currentNetwork == "Optimism") {
      setTokenAddress(OPTIMISM_TOKEN_ADDRESS);
    }*/
  //}, []);

  async function delay() {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }

  useEffect(() => {
    if (!currentAccount) return;
    tokenAddress?.map(async (v, i) => {
      await findERC20Tokens(
        "0x6c25cf6B6F2635dB80e32bB31e6E6131d3042382",
        v.address,
        v.name
      );
    });
  }, [currentAccount]);

  return (
    <div className="container-dashboard dashboard-bg pt-2 relative flex flex-col">
      <div className="flex-grow overflow-auto">
        <div className="sticky flex flex-row justify-between px-6 py-2 text-base dm-sans-token text-purple-900">
          <div>AMOUNT</div>
          <div>USD VALUE</div>
        </div>
        {balance?.map((v, i) => (
          <TokenCard key={i} ticker={v.ticker} value={v.value} />
        ))}
      </div>
      <div className="sticky bottom-2 text-right bg-green-200 m-2 px-auto dm-sans-token">
        TOTAL VALUE: $108
      </div>
    </div>
  );
};

export default Tokens;
