import React,{useState, useContext} from 'react'
import './login.css'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import {toast} from 'react-toastify';  
import Cookies from 'universal-cookie';
import logo from '../../Images/logoFeeDesMaths.png'
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()

const Login = ()=>{
    // eslint-disable-next-line
    const {state, dispatch}= useContext(UserContext)
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const history = useHistory()

    const cookies = new Cookies();

    var is_fired = false;
    const enterPressed = (event)=>{
        if(event.key === "Enter" && is_fired===false){
            is_fired = true
            postData()
        }
    }

    const postData = ()=>{
        fetch("/api/login",{
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
                    // toast(data.error)
                    if(data.error.email){
                        // console.log(data.error.email)
                        toast.error(data.error.email, {autoClose: 3000})
                    }
                    if(data.error.password){
                        // console.log(data.error.password)
                        toast.error(data.error.password, {autoClose: 3000})
                        // data.error.email
                    }
                    toast.error(data.error, {autoClose: 3000})
                    // window.alert(data.error)
                }
                else{

                    // 
                    // localStorage.setItem("jwt",data.token)
                    cookies.set('jwt', data.token, { path: '/' , expires: new Date(Date.now()+3600000)})
                    // console.log(cookies.get('jwt'))
                    localStorage.setItem("user",JSON.stringify(data.user))
                    // 

                    dispatch({type:"USER", payload:data.user})
                    toast.success('signed in', {autoClose: 3000})
                    // window.alert("signed in")
                    history.push('/')
                }
            }).catch(err=>{
            console.log(err)
        })
    }


    return(
    <div className="container h-100">
        <div className="d-flex justify-content-center h-100">
            <div id="user_card_login">
                <div className="d-flex justify-content-center">
                    <div id="brand_logo_container_login">
                        <img src={logo} id="brand_logo_login" alt="Logo"/>
                    </div>
                </div>
                <div className="d-flex justify-content-center" id="form_container_login">
                    <form>
                        <div className="input-group mb-3">
                            <div className="input-group-append">
                                <span className="input-group-text">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-envelope" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
                                </svg>
                                </span>
                            </div>
                            <input
                            className="form-control input_user"
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            onKeyDown={(e) => enterPressed(e)}
                            />
                        </div>
                        <div className="input-group mb-2">
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-key-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                    </svg>
                                </span>
                            </div>
                            <input
                            id="password_input"
                            className="form-control input_pass"
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            onKeyDown={(e) => enterPressed(e)}
                            />
                        </div>
                        <div className="form-group">
                        </div>
                        <div className="d-flex justify-content-center mt-3 " id="login_container">
                            <button type="button" name="button" className="btn" id="login_btn" onClick={()=> postData()}>Login</button>
                        </div>
                    </form>
                </div>
                <div className="mt-4">
                    <div className="d-flex justify-content-center links">
                        Don't have an account? <Link to="/register" className="ml-2">Sign Up</Link>
                    </div>
                    <div className="d-flex justify-content-center links">
                        <Link to="/settings">Forgot your password?</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    )
}


export default Login