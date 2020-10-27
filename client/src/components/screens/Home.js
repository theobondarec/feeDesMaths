import React from 'react'
import './Pages.css'

const Home = ()=>{
    return(
        <div>
            <h1>Home</h1>
            <p>{
            
            localStorage.getItem("user")
            
            }</p>
        </div>
    )
}

export default Home