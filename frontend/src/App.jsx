import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Main from "./pages/main";
import WalletLayout from "./components/WalletLayout";
import Create from "./pages/create";
import Send from "./pages/send";
import { AuthProvider } from "./components/Auth";
import ImportTokens from "./pages/importTokens";
// import TransactionHistory from "./pages/transactionHistory";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<WalletLayout />}>
            <Route index element={<Home />} />
            <Route path="wallet" element={<Create />} />
            {/* <Route path="import" element={<Import />} /> */}
            {/* <Route path="unlock" element={<Login />} /> */}
            <Route path="feed" element={<Layout />}>
              <Route index element={<Main />} />
              <Route path="send" element={<Send />} />
              <Route path="import" element={<ImportTokens />} />
              {/* <Route path="history" element={<TransactionHistory />} /> */}
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
