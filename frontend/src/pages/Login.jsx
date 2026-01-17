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

  const navigate = useNavigate();


  const handleSignup = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
  
    if (error) {
      alert(error.message);
      return;
    }
  
    alert('Signup successful! Please verify email.');
  };


  const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  const accessToken = data.session.access_token;

  // Store token (recommended)
  localStorage.setItem('sb_token', accessToken);

  navigate('/Grocery');
};


  return (
    <div className="login-wrapper">
      <div className="container">
        <div className="login-header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {/* Name field only for Sign Up */}
          {action === "Sign Up" && (
            <div className="input">
              <PersonIcon className="icon" />
              <input type="text" placeholder="Name" />
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
          {/* Forgot password only for Login */}
          {action === "Login" && (
            <div className="forgot-password">
              Forgot password? <span>Click here</span>
            </div>
          )}
          <div className="submit-container">
            {/* Sign Up Button */}
            <div
              className={`submit ${action === "Sign Up" ? "":"inactive"}`}
              onClick={() => setAction("Sign Up")}
            >
              Sign Up
            </div>
            {/* Login Button */}
            <div
              className={`submit ${action === "Login"?"":"inactive"}`}
              onClick={() => {
                if (action === "Login") {
                  handleLogin();
                } else {
                  setAction("Login");
                }
              }}
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
