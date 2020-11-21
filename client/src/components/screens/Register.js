import React,{useState, useContext} from 'react'
import './Pages.css'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'

const Signup = ()=>{
    const {state, dispatch}= useContext(UserContext)
    const [name, setName]= useState("")
    const [isenId, setIsenId]= useState("")
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const history = useHistory()

    const postData = ()=>{
        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            window.alert('Invalid Email !')          //PAS window.alert MAIS un TOAST AVEC BOOTSTRAP
            return
        }
        fetch("/register",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                isenId,
                email,
                password
            })
        }).then(res=>res.json())
        .then(data => {
            if(data.error){
                console.log(data.error)
                window.alert(data.error)            //PAS window.alert MAIS un TOAST AVEC BOOTSTRAP
            }
            else{
                // window.alert(data.message)          //PAS window.alert MAIS un TOAST AVEC BOOTSTRAP
                window.alert("user saved !")
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="myCard">
            <div className="card auth-card">
                <h1>Register</h1>
                <input 
                type="text"
                placeholder="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <input 
                type="text"
                placeholder="isenId"
                value={isenId}
                onChange={(e)=>setIsenId(e.target.value)}
                />
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
                onClick={()=> postData()}
                >Register</button>
                <div className="dropdown-divider"></div>
                <Link to="/login">Already have an account ? Sign in</Link>
            </div>
        </div>
    )
}

export default Signup