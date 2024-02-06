import {
  BrowserRouter,
  Routes,
  Route,
  UNSAFE_RouteContext,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Main from "./pages/main";
import WalletLayout from "./components/WalletLayout";
import Signup from "./pages/signup";
import Send from "./pages/send";

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
          <Route path="/send" element={<Send />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
