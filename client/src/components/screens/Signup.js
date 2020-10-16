import React from 'react'
import './Pages.css'
import {Link} from 'react-router-dom'
const Signup = ()=>{
    return(
        <div className="myCard">
            <div className="card auth-card">
                <h1>Register</h1>
                <input 
                type="text"
                placeholder="name"
                />
                <input 
                type="text"
                placeholder="isenId"
                />
                <input 
                type="text"
                placeholder="email"
                />
                <input 
                type="password"
                placeholder="password"
                />
                <button type="button" className="btn btn-primary">Register</button>
                <div className="dropdown-divider"></div>
                <Link to="/login">Already have an account ? Sign in</Link>
            </div>
        </div>
    )
}

export default Signup