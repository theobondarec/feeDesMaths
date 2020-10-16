import React from 'react'
import './Pages.css'
import {Link} from 'react-router-dom'
const Login = ()=>{
    return(
        <div className="myCard">
            <div className="card auth-card">
                <h1>Login</h1>
                <input 
                type="text"
                placeholder="email"
                />
                <input 
                type="password"
                placeholder="password"
                />
                <button type="button" className="btn btn-primary">Login</button>
                <div className="dropdown-divider"></div>
                <div className="loginFooter">
                    <Link to="/signup">Don't have an account ? Sign up</Link>
                    <Link to="/restpassword">forgotten password ?</Link>
                </div>
            </div>
        </div>
    )
}

export default Login