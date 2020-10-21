import React from 'react'
import './Pages.css'

const Settings = ()=>{
    return(
        <div className="myCard">
            <div className="card auth-card">
                <h1>Settings</h1>

                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Email"></input>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">Modifier</button>
                    </div>
                </div>
                <p>you can reset your password, enter your email below</p>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Email"></input>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">Reset Password</button>   
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings