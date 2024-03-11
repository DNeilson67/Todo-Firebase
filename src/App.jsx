import "./pages/App.css";
import Todo from "./pages/dashboard.jsx";
import Login from './pages/login.jsx';
import Account from "./pages/account.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} exact />
        <Route path="/todo" element={<Todo />} />
        <Route path ="/account" element = {<Account />} />
      </Routes>
    </Router>
  );
}

export default App;
