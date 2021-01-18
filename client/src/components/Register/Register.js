import React,{useState} from 'react'
import './register.css'
import {Link, useHistory} from 'react-router-dom'
import logo from '../../Images/logoFeeDesMaths.png'
import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()

const Signup = ()=>{
    const [name, setName]= useState("")
    // const [isenId, setIsenId]= useState("")
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const history = useHistory()

    const postData = ()=>{
        // if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
        //     // toast('Invalid Email !')
        //     toast.error('Invalid Email !', {autoClose: 3000})
        //     // window.alert('Invalid Email !')
        //     return
        // }
        fetch("/api/register",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                // isenId,
                email,
                password
            })
        }).then(res=>res.json())
        .then(data => {
            if(data.error){
                // toast(data.error)
                // console.log(data.error)
                toast.error(data.error, {autoClose: 3000})
                if(data.error.name){
                    toast.error(data.error.name, {autoClose: 3000})
                }
                if(data.error.email){
                    toast.error(data.error.email, {autoClose: 3000})
                }
                if(data.error.password){
                    toast.error(data.error.password, {autoClose: 3000})
                }
                
                // window.alert(data.error)
            }
            else{
                // toast(data.message)
                toast.success(data.message, {autoClose: 3000})
                // window.alert(data.message)
                history.push('/login')
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="container h-100">
        <div className="d-flex justify-content-center h-100">
            <div id="user_card_register">
                <div className="d-flex justify-content-center">
                    <div id="brand_logo_container">
                        <img src={logo} id="brand_logo" alt="Logo"/>
                    </div>
                </div>
                <div className="d-flex justify-content-center" id="form_container">
                    <form>
                    <div className="input-group mb-2">
                            <div className="input-group-append">
                                <span className="input-group-text">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                </svg>
                                </span>
                            </div>
                            <input
                            className="form-control input_user"
                            type="text"
                            placeholder="name"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            />
                        </div>
                        <div className="input-group mb-2">
                            <div className="input-group-append">
                                <span className="input-group-text">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-envelope" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
                                </svg>
                                </span>
                            </div>
                            <input
                            className="form-control input_email"
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
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
                            className="form-control input_pass"
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                        </div>
                        <div className="d-flex justify-content-center mt-3 " id="register_container">
                            <button type="button" name="button" className="btn " id="register_btn" onClick={()=> postData()}>Register</button>
                        </div>
                    </form>
                </div>
                <div className="mt-4">
                    <div className="d-flex justify-content-center links">
                    Already have an account ?<Link to="/login" className="ml-2">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
    )
}

export default Signup

