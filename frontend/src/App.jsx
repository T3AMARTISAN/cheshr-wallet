import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Main from "./pages/main";
import WalletLayout from "./components/WalletLayout";
import Signup from "./pages/signup";
import Send from "./pages/send";
// import TransactionHistory from "./pages/transactionHistory";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WalletLayout />}>
          <Route index element={<Home />} />
          <Route path="wallet" element={<Signup />} />
          {/* <Route path="import" element={<Login />} /> */}
        </Route>
        <Route path="feed" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="send" element={<Send />} />
          {/* <Route path="history" element={<TransactionHistory />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
