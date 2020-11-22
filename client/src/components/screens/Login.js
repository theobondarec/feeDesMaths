import React,{useState, useContext} from 'react'
import './Pages.css'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'

const Login = ()=>{
    const {state, dispatch}= useContext(UserContext)
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const history = useHistory()

    const postData = ()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            window.alert('Invalid Email !')          //PAS window.alert MAIS un TOAST AVEC BOOTSTRAP
            return
        }
        fetch("/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data => {
            // console.log(data)
            if(data.error){
                window.alert(data.error)            //PAS window.alert MAIS un TOAST AVEC BOOTSTRAP
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                window.alert("signed in")          //PAS window.alert MAIS un TOAST AVEC BOOTSTRAP
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="myCard">
            <div className="card auth-card">
                <h1>Login</h1>
                <input 
                type="email"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button type="button" className="btn btn-primary"
                onClick={()=> postData()}>
                    Login
                </button>
                <div className="dropdown-divider"></div>
                <div className="loginFooter">
                    <Link to="/register">Don't have an account ? Sign up</Link>
                    <Link to="/restpassword">forgotten password ?</Link>
                </div>
            </div>
        </div>
    )
}

export default Login