import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Main from "./pages/main";
import WalletLayout from "./components/WalletLayout";
import Signup from "./pages/signup";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<WalletLayout />}>
            <Route index element={<Signup />} />
          </Route>
          <Route path="/main" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
