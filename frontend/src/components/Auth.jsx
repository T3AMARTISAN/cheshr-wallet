import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    // const hasWallet = checkWallet();

    // currentAccount가 비어있는 경우 - 잠금 또는 지갑이 없는 상태
    // 홈화면으로 이동한다
    if (!isAuthenticated) {
      navigate("/");
    }
  });

  const checkAuthentication = () => {
    return !!currentAccount;
  };

  // const checkWallet = () => {
  //   const wallet = localStorage.getItem("dexwalletData");
  //   return !!wallet;
  // };

  return (
    <AuthContext.Provider value={{ currentAccount, setCurrentAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
