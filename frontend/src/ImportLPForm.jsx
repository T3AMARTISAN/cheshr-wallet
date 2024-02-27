import { ethers } from "ethers";
import { useContext, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "./components/Auth";

// sUSD-ETH
// 0xf80758ab42c3b07da84053fd88804bcb6baa4b5c
// 이 lp 컨트랙트로 실험해보면 로컬 추가 후 테스트계정의 디파이 화면에 lp 추가되는 것 확인 가능

export const ImportLPForm = () => {
  const {
    currentProvider,
    lpV2Array,
    setLpV2Array,
    currentNetwork,
    addedLps,
    setAddedLps,
    importOpen,
    setImportOpen,
  } = useOutletContext(); //새로 추가된 lp 컨트랙트 정보 불러오기 위해 필요
  const [addLpButtonIsClicked, setAddLpButtonIsClicked] = useState(1); //모달창 화면 관리 상태변수
  const [newLp, setNewLp] = useState(""); //페어 추가 컨펌 화면에 페어 이름과 주소 보여주기 위해 상태변수로 저장
  const [newLpAddress, setNewLpAddress] = useState(""); //사용자 인풋으로 받은 주소 관리하는 상태변수

  //사용자가 lp 컨트랙트 주소 입력 후 추가하기 버튼 눌렀을 때 작동하는 함수로
  // 1) 기존 db에 lp 주소가 있는지 확인 후
  // 2) getContract() 실행해 제대로 된 lp 컨트랙트인지 확인
  const onSubmitAddLp = async (e) => {
    try {
      e.preventDefault();

      if (!newLpAddress) return;

      //인풋 지갑주소 소문자로 변환
      var lowercaseLpAddress = newLpAddress.toString();
      lowercaseLpAddress = lowercaseLpAddress.toLowerCase();

      //이미 있는 lp 컨트랙트인지 확인
      //count로 동일 주소가 있는지 세주고 판단 기준(>0)으로 사용
      var count = 0;
      lpV2Array.map((v, i) => {
        if (v.address == lowercaseLpAddress) {
          count++;
          return;
        }
      });

      //이미 컨트랙트가 있는 경우 에러 화면 띄워준다.
      if (count > 0) {
        setAddLpButtonIsClicked(3);
        return;
      } else {
        //새로운 주소인 경우 getContract() 함수 실행한다.
        getContract(newLpAddress);
      }
    } catch (error) {
      //에러 화면 띄워준다.
      console.log(error);
      setAddLpButtonIsClicked(3);
    }
  };

  //사용자가 입력한 값이 제대로 된 lp 컨트랙트 주소인지 확인 후 (asdf 입력하면 에러처리)
  // 1) 제대로 된 lp 주소면 최종적으로 페어 이름을 확인하고 로컬에 추가할 수 있는 컨펌 화면 띄워준다.
  // 2) 제대로 된 주소 아니면 catch를 통해 에러 화면 띄워준다.
  const getContract = async (_contractAddress) => {
    try {
      //etherscan api로 ABI 가져와 ethers 컨트랙트 구성((1)이게 안 되면 제대로 된 lp 주소 아니고, (2) 페어 이름 불러오기 위해 컨트랙트 객체 필요)
      var contractAddress = _contractAddress.toString();
      var contract_url;
      if (currentNetwork == "Ethereum") {
        contract_url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
      } else if (currentNetwork == "Polygon") {
        contract_url = `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.REACT_APP_POLYGONSCAN_API_KEY}`;
      } else if (currentNetwork == "Optimism") {
        contract_url = `https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.REACT_APP_OPTIMISMSCAN_API_KEY}`;
      } else {
        console.log("network unavailable");
        setAddLpButtonIsClicked(3);
        setNewLpAddress("");
      }

      const contract_response = await fetch(contract_url);
      var { result } = await contract_response.json();
      const contract_abi = result[0].ABI;
      const contract = new ethers.Contract(
        contractAddress,
        contract_abi,
        currentProvider
      );

      // token0 이름 불러오고
      var token0 = await contract.token0();
      token0 = token0.toString();
      var contract_url_0;
      if (currentNetwork == "Ethereum") {
        contract_url_0 = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
      } else if (currentNetwork == "Polygon") {
        contract_url_0 = `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_POLYGONSCAN_API_KEY}`;
      } else if (currentNetwork == "Optimism") {
        contract_url_0 = `https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address=${token0}&apikey=${process.env.REACT_APP_OPTIMISMSCAN_API_KEY}`;
      } else {
        console.log("network unavailable");
        setAddLpButtonIsClicked(3);
        setNewLpAddress("");
      }

      const contract_response_0 = await fetch(contract_url_0);
      var { result } = await contract_response_0.json();
      const contract_abi_0 = result[0].ABI;
      const contract_0 = new ethers.Contract(
        token0,
        contract_abi_0,
        currentProvider
      );
      const token0_symbol = await contract_0.symbol();

      // token1 이름 불러와서
      var token1 = await contract.token1();
      token1 = token1.toString();
      var contract_url_1;
      if (currentNetwork == "Ethereum") {
        contract_url_1 = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${token1}&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
      } else if (currentNetwork == "Polygon") {
        contract_url_1 = `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${token1}&apikey=${process.env.REACT_APP_POLYGONSCAN_API_KEY}`;
      } else if (currentNetwork == "Optimism") {
        contract_url_1 = `https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address=${token1}&apikey=${process.env.REACT_APP_OPTIMISMSCAN_API_KEY}`;
      } else {
        console.log("network unavailable");
        setAddLpButtonIsClicked(3);
        setNewLpAddress("");
      }

      const contract_response_1 = await fetch(contract_url_1);
      var { result } = await contract_response_1.json();
      const contract_abi_1 = result[0].ABI;
      const contract_1 = new ethers.Contract(
        token1,
        contract_abi_1,
        currentProvider
      );
      const token1_symbol = await contract_1.symbol();

      //LP.json 파일 형식 맞추기 위해 token0-token1로 페어 이름 구성
      const pairName = token0_symbol + "-" + token1_symbol;

      //페어 추가 컨펌 화면에 페어 이름과 주소 보여주기 위해 상태변수로 저장
      setNewLp({
        name: pairName,
        address: _contractAddress,
        abi: contract_abi,
      });

      //로컬에 저장할 배열 addedLps에 추가. 실제 추가는 컨펌 화면에서 버튼 눌러야 추가됨.
      setAddedLps([
        ...addedLps,
        {
          name: pairName,
          address: contractAddress,
          abi: contract_abi,
        },
      ]);
      console.log("162 addedlps changed");
      //정확한 페어인지 최종적으로 확인하는 컨펌 화면으로 넘겨준다.
      setAddLpButtonIsClicked(2);
    } catch (error) {
      console.log(error);
      //에러 발생 화면으로 보내준다.
      setAddLpButtonIsClicked(3);
      setNewLpAddress("");
    }
  };

  //원하는 페어임을 확인해 lp 컨트랙트를 최종적으로 로컬에 저장하는 함수
  const onClickConfirmAddition = () => {
    //로컬에 입력
    const jsonLpArray = JSON.stringify(addedLps);
    localStorage.setItem("addedLps", jsonLpArray);
    setNewLpAddress("");
    setImportOpen(!importOpen);
  };

  return (
    <>
      {addLpButtonIsClicked == 1 && (
        <>
          {/* LP 컨트랙트 임포트 정보 입력란 */}
          <form
            onSubmit={onSubmitAddLp}
            className="flex flex-col gap-2 justify-center items-center mt-10"
          >
            <div className="flex flex-row justify-center">
              {/* 항목 */}
              <div className="flex flex-col justify-center items-start gap-5 mx-2">
                {/* LP 컨트랙트 주소 */}
                <div className="dm-sans text-xl text-purple-100 w-30 px-2">
                  CONTRACT
                </div>
              </div>

              {/* 입력란 */}
              <div className="flex flex-col justify-center items-end gap-3">
                {/* 사용자가 추가할 lp 컨트랙트 주소 입력하는 곳 */}

                <input
                  type="text"
                  value={newLpAddress}
                  onChange={(e) => setNewLpAddress(e.target.value)}
                  className="modal-inputbox p-2 dm-sans text-sm"
                  placeholder="Enter LP Contract address"
                ></input>
              </div>
            </div>

            {/* Import버튼 */}
            <input type="submit" value="Import" className="modal-button mt-8" />
          </form>
        </>
      )}

      {addLpButtonIsClicked == 2 && (
        <div className="flex flex-col justify-center items-center">
          <div className="dm-sans text-white whitespace-pre-line text-center leading-6 text-lg py-8">{`Confirm the details!`}</div>
          {/* 내가 추가한 주소의 페어 이름 보여주기 */}
          <div className="dm-sans text-white text-xl">{newLp.name}</div>
          {/* 내가 추가한 주소의 lp 컨트랙트 주소 보여주기 */}
          <div className="dm-sans text-white text-xl">{newLp.address}</div>
          <div>
            {/* 로컬에 lp 추가하고 모달창 끄는 버튼 */}
            <button
              className="modal-button py-2"
              onClick={onClickConfirmAddition}
            >
              Confirm
            </button>
            {/* 주소 입력 화면으로 돌아가기 버튼 */}
            <button
              className="modal-button py-2"
              onClick={() => setAddLpButtonIsClicked(1)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* 에러 화면(잘못된 주소 입력) */}
      {addLpButtonIsClicked == 3 && (
        // 띄워줄 에러 메시지
        <div className="flex flex-col justify-center items-center">
          <div className="dm-sans whitespace-pre-line text-center leading-6 text-lg py-8">{`Uh-oh. Wrong address.
          Try again?`}</div>
          {/* 주소 입력 화면으로 돌아가는 버튼 */}
          <button
            className="modal-button"
            onClick={() => setAddLpButtonIsClicked(1)}
          >
            Retry
          </button>
        </div>
      )}
    </>
  );
};
