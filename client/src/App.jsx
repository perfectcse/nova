import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [showRegister, setShowRegister] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setShowRegister(false);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return showRegister ? (
    <Register
      onRegisterSuccess={handleRegisterSuccess}
      onShowLogin={() => setShowRegister(false)}
    />
  ) : (
    <Login
      onLoginSuccess={handleLoginSuccess}
      onShowRegister={() => setShowRegister(true)}
    />
  );
}

export default App;