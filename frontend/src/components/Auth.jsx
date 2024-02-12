import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    const hasWallet = checkWallet();
    // if (!isAuthenticated && hasWallet) {
    //   navigate("/unlock");
    // }
  });

  const checkAuthentication = () => {
    return !!currentAccount;
  };

  const checkWallet = () => {
    const wallet = localStorage.getItem("dexwalletData");
    return !!wallet;
  };

  return (
    <AuthContext.Provider value={{ currentAccount, setCurrentAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
