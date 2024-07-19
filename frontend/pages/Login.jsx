import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer"; // Assuming this hook exists

const Login = () => {
  const { dispatch } = useGlobalReducer(); // Assuming useGlobalReducer provides a dispatch function
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://didactic-acorn-r4766ggwwxrvc5g54-3001.app.github.dev/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        // Handle non-JSON response
        data = await response.text();
        throw new Error(`Non-JSON response: ${data}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      dispatch({ type: 'update_user', user: data.user });
      dispatch({ type: 'update_token', token: data.token });
      navigate("/private"); // Redirect to private route after successful login
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="card text-dark col-10 mx-auto my-5 p-5">
      <h1 className="d-flex justify-content-center">LOGIN</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby="emailHelp"
            required
          />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">Keep me logged in</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <Link to="/">Don't have an account? Sign Up</Link>
    </div>
  );
};

Login.propTypes = {
  match: PropTypes.object // Adjust according to your specific needs
};

export default Login;
