import { useEffect, useState } from "react";
import LpPoolCard from "./LpPoolCard";
import AddLpModal from "./AddLpModal";
import lpContractDb from "../utils/LP.json";
import { useOutletContext } from "react-router-dom";

//사용자가 보유한 LP 토큰을 보여주는 화면
const DeFi = () => {
  const { currentAccount, setCurrentAccount } = useOutletContext(); //테스트->실제로 변경  시  setCurrentAccount useEffect 제거하면 됨
  const [lpArray, setLpArray] = useState(); //사용자의 lp 잔고 조회할 모든 컨트랙트 주소 담은 배열 (여기에 LP.json과 로컬 json 담아준다)
  const [addLpButtonIsClicked, setAddLpButtonIsClicked] = useState(0); //모달창 화면 관리 상태변수
  const [addedLps, setAddedLps] = useState([]); //로컬에 저장된 LP의 목록을 리액트로 불러와 관리(추가)하기 위한 상태변수

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

  //테스트 시 테스트 지갑 주소 하드코딩 부분. 테스트 ->실제 변경 시 유즈이펙트 제거해주면 됨
  useEffect(() => {
    setCurrentAccount(process.env.REACT_APP_TEST_ACCOUNT);
  }, []);

  //로컬에 lp가 추가되거나(AddLpModal.jsx에서) 계정에 로그인되었을 때 useEffect로 전체 lpArray 배열을 업데이트해준다.
  useEffect(() => {
    if (addLpButtonIsClicked != 0) return;
    getMyLps();
  }, [currentAccount, addLpButtonIsClicked]);

  return (
    <div className="relative bg-pink-300 ">
      {/* lpArray 하나씩 조회해 각 lp 토큰 카드로 뿌려줌. 잔고 있는지 유무는 LpPoolCard 컴포넌트에서 판단 */}
      {lpArray?.map((v, i) => (
        <LpPoolCard
          _lpContractAddress={v.address}
          _lpAbi={v.abi}
          _pairname={v.name}
          key={i}
        />
      ))}

      {/* 모달창 */}
      {addLpButtonIsClicked > 0 && (
        <AddLpModal
          addLpButtonIsClicked={addLpButtonIsClicked}
          setAddLpButtonIsClicked={setAddLpButtonIsClicked}
          addedLps={addedLps}
          setAddedLps={setAddedLps}
          lpArray={lpArray}
        />
      )}

      {/* lp 토큰 추가하기 버튼, 누르면 AddLpModal 모달창이 나온다 */}
      <div className="absolute bottom-4 right-4">
        <button
          className="bg-green-300  w-16 h-16 rounded-full"
          onClick={() => setAddLpButtonIsClicked(1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default DeFi;
