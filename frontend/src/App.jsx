import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Main from "./pages/main";
import WalletLayout from "./components/WalletLayout";
import Create from "./pages/create";
import Send from "./components/SendModal";
import { AuthProvider } from "./components/Auth";
import ImportTokens from "./pages/importTokens";
import Mount from "./pages/mount";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<WalletLayout />}>
            <Route index element={<Home />} />
            <Route path="wallet" element={<Create />} />
            <Route path="mount" element={<Mount />} />
          </Route>
          <Route path="feed" element={<Layout />}>
            <Route index element={<Main />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
