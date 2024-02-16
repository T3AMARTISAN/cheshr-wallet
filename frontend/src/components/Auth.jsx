import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [locked, setLocked] = useState(true);
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const checkStatus = () => {
    return locked;
  };

  const checkPw = () => {
    return pw;
  };

  useEffect(() => {
    const lockStatus = checkStatus();

    if (lockStatus) {
      navigate("/");
    }
  }, [checkStatus()]);

  useEffect(() => {
    const pwStatus = checkPw();
  }, [checkPw()]);

  return (
    <AuthContext.Provider value={{ locked, setLocked, pw, setPw }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
