import React, { useState } from "react";
import "../styles/Login.css";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supeabaseClient";

const Login = () => {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        email,
      });
    }

    alert("Signup successful! Check your email and login.");
    setAction("Login");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/grocery");
  };

  return (
    <div className="login-wrapper">
      <div className="container">
        <div className="login-header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          {action === "Sign Up" && (
            <div className="input">
              <PersonIcon className="icon" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="input">
            <EmailIcon className="icon" />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input">
            <VisibilityIcon className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {action === "Login" && (
            <div className="forgot-password">
              Forgot password? <span>Click here</span>
            </div>
          )}

          <div className="submit-container">
            <div
              className={`submit ${action === "Sign Up" ? "" : "inactive"}`}
              onClick={() =>
                action === "Sign Up" ? handleSignup() : setAction("Sign Up")
              }
            >
              Sign Up
            </div>

            <div
              className={`submit ${action === "Login" ? "" : "inactive"}`}
              onClick={() =>
                action === "Login" ? handleLogin() : setAction("Login")
              }
            >
              Login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
