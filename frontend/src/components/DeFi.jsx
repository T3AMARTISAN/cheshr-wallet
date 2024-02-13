import { useEffect, useState } from "react";
import LpPoolCard from "./LpPoolCard";
import lpContractDb from "../utils/LP.json";
import { ethers } from "ethers";
import { Await, useOutletContext } from "react-router-dom";

const DeFi = () => {
  //테스트->실제로 변경  시  setCurrentAccount와 이 useEffect 제거하면 됨
  const { currentAccount, setCurrentAccount, isAddLpButtonClick } =
    useOutletContext();

  const [lpArray, setLpArray] = useState();

  const getMyLps = async () => {
    try {
      //나중에 로컬 스토리지에서 가져와야 해서
      if (!currentAccount) return;

      var temp = [];

      //json에 있는 주소 넣기
      temp = lpContractDb;

      //사용자가 입력한 lpContract 로컬에서 받아와 temp에 저장

      setLpArray(temp);
    } catch (error) {
      console.log(error);
    }
  };

  //테스트 시 테스트 지갑 주소 하드코딩 부분. 테스트 ->실제 변경 시 유즈이펙트 제거해주면 됨
  useEffect(() => {
    setCurrentAccount(process.env.REACT_APP_TEST_ACCOUNT);
  }, []);

  useEffect(() => {
    getMyLps();
  }, [currentAccount]);

  return (
    <div className="relative bg-pink-300 ">
      {lpArray?.map((v, i) => (
        <LpPoolCard
          _lpContractAddress={v.address}
          _lpAbi={v.abi}
          _pairname={v.name}
          key={i}
        />
      ))}
    </div>
  );
};

export default DeFi;
