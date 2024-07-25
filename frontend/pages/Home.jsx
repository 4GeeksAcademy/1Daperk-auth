import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      console.log(data.message); 
      navigate("/login"); // Redirect to login page after successful signup
    } catch (error) {
      console.error('Error:', error.message);
      // Handle signup error, show message to user.
    }
  }

  return (
    <div className="card text-dark col-10 mx-auto my-5 p-5">
      <form onSubmit={handleSignUp}>
        <fieldset>
          <legend className="d-flex justify-content-center fs-1"> SIGN UP </legend>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email</label>
            <input 
              type="email" 
              id="emailInput" 
              className="form-control" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">Password</label>
            <input 
              type="password" 
              id="passwordInput" 
              className="form-control" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </fieldset>
      </form>
      <Link to="/login">Already have an account? Login</Link>
    </div>
  );
};

Home.propTypes = {
  match: PropTypes.object
};

export default Home;
