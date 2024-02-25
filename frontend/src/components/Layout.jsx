import { Outlet } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import WalletDropdown from "./WalletDropdown";

const Layout = () => {
  const [isNetworkButtonClick, setIsNetworkButtonClick] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(
    // v6 : new ethers.InfuraProvider()
    // v5
    new ethers.providers.EtherscanProvider(
      "homestead",
      process.env.REACT_APP_ETHERSCAN_API_KEY
    )
  );
  const [currentNetwork, setCurrentNetwork] = useState("Ethereum");
  const [chainName, setChainName] = useState("ethereum");
  const [currentAccount, setCurrentAccount] = useState("");
  const [tabNumber, setTabNumber] = useState(0);
  const [balance, setBalance] = useState(0);
  const [unit, setUnit] = useState("ETH");
  const [lpV2Array, setLpV2Array] = useState(); //사용자의 lp 잔고 조회할 모든 컨트랙트 주소 담은 배열 (여기에 LP.json과 로컬 json 담아준다)
  const [addedLps, setAddedLps] = useState([]); //로컬에 저장된 LP의 목록을 리액트로 불러와 관리(추가)하기 위한 상태변수
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="container-feed radial-bg-feed">
      <Outlet
        context={{
          tabNumber,
          setTabNumber,
          isNetworkButtonClick,
          setIsNetworkButtonClick,
          currentProvider,
          setCurrentProvider,
          currentNetwork,
          setCurrentNetwork,
          currentAccount,
          setCurrentAccount,
          balance,
          setBalance,
          unit,
          setUnit,
          chainName,
          setChainName,
          lpV2Array,
          setLpV2Array,
          addedLps,
          setAddedLps,
          importOpen,
          setImportOpen,
        }}
      />
    </div>
  );
};

export default Layout;
