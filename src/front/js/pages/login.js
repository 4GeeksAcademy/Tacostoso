import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Login = () => {

    const { store, actions } = useContext(Context);

    const [user, setUser] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (store.token) {
            navigate("/");
        }
    }, []);

    return (
        <div className="mx-auto my-auto flex flex-col">
            <h1 className="text-center">Login</h1>
            <div className="mb-3">
                <label className="form-label">Email address</label>
                <input type="email" className="form-control" onChange={(event) => setUser({
                    ...user,
                    email: event.target.value
                })} />
                <div className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="d-flex">
                    <input type={showPassword ? "text" : "password"} className="form-control" onChange={(event) => setUser({
                        ...user,
                        password: event.target.value
                    })} />
                    <button className="btn btn-success"
                        onClick={() => setShowPassword(!showPassword)}
                    >{showPassword ? "🔒" : "👀"}</button>
                </div>
                <button className="btn btn-link">Forgot your password?</button>
            </div>
            <button onClick={() => actions.login(user.email, user.password)}
                className="btn btn-success w-100 mt-2">Login</button>
            <Link to="/register" className="btn btn-link">Don't have an account? Register here</Link>
        </div>
    );
};

export default Login;