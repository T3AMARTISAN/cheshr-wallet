import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [locked, setLocked] = useState(true);
  const navigate = useNavigate();

  const checkStatus = () => {
    return !!locked;
  };

  useEffect(() => {
    const lockStatus = checkStatus();

    if (lockStatus) {
      navigate("/");
    }
  }, [checkStatus()]);

  return (
    <AuthContext.Provider value={{ locked, setLocked }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
