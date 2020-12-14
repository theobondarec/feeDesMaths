import React,{useState, useContext} from 'react'
import './Settings.css'
import firebase from '@firebase/app'
import auth from '@firebase/auth'
import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()

const config = {
    "apiKey": process.env.REACT_APP_API_KEY,
    "authDomain": process.env.REACT_APP_API_authDomain,
    "databaseURL": process.env.REACT_APP_API_databaseURL,
    "projectId": process.env.REACT_APP_API_projectId,
    "storageBucket": process.env.REACT_APP_API_storageBucket,
    "messagingSenderId": process.env.REACT_APP_API_messagingSenderId,
    "appId": process.env.REACT_APP_API_appId,
    "measurementId": process.env.REACT_APP_API_measurementId
}

const Settings = ()=>{
    const [emailAddress, setEmailAddress] = useState("")
    if(!firebase.apps.length){
        firebase.initializeApp(config)
    }  
    const resetPassword = ()=>{
        // console.log(emailAddress)
        firebase.auth().sendPasswordResetEmail(emailAddress)
        .then(()=> {
            document.getElementById('email').value = ""
            toast.success("an email have been send")

        })
        .catch((err) => {
            console.log(err)
            toast.error(err.message, {autoClose: 3000})
        })
    }

    return(
        <div className="container h-100">
            <div className="d-flex justify-content-center h-100">
                <div id="user_card_setting">
                    <div className="d-flex justify-content-center form_container">
                        <form>
                            <h1 id="title">Settings</h1>
                            <p>You can reset your password, enter your email below</p>
                            <div className="input-group mb-3">
                                <input
                                class="form-control"
                                type="texte"
                                placeholder="Email"
                                id="email"
                                onChange={(e)=>{setEmailAddress(e.target.value)}}
                                />  
                            </div>
                            <div className="d-flex justify-content-center mt-3" id="setting_container">
                                <button type="button" className="btn" id="resetPassword_btn" onClick={()=>{resetPassword()}}>Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings