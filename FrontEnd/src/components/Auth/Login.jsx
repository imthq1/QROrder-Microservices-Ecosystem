import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { loginAdmin } from "../../services/auth/authService";
import "../../styles/Login.css";
import loginImg from "../../assets/download.jpg";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { access_token, userLogin } = await loginAdmin(username, password);
      login(access_token, userLogin);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div className="login-page">
      {/* LEFT */}
      <div className="login-left">
        <img src={loginImg} alt="Admin Login" className="login-illustration" />
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <h1>Welcome Back!</h1>
        <p className="subtitle">Đăng nhập hệ thống quản lý nhà hàng</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <span className="icon">@</span>
            <input
              type="text"
              placeholder="Admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
