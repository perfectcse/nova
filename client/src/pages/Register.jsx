import { useState } from "react";
import api from "../service/api";
import "../styles/register.css";

function Register({ onRegisterSuccess, onShowLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess(
        "Registration successful! You can now login."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        onRegisterSuccess();
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1>NOVA</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>

            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

          {success && (
            <p className="register-success">
              {success}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div className="register-footer">
          <span>Already have an account?</span>

          <button
            type="button"
            className="auth-switch-button"
            onClick={onShowLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;