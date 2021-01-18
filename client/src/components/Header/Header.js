import React from 'react'
import './Header.css'
import logo from '../../Images/logoFeeDesMaths.png'

const Header = () =>{
    return(
        <header>
                <div className="row"id="head">
                    <div className="col-12">
                        <h1 id="h1">Fée des maths</h1>
                        <h2 id="h2">- Site d'apprentissage pour MPSI -</h2>
                        <img src={logo} alt= "logo" id="logo"/>
                    </div>
                </div>
            
        </header>
    )
} 
export default Header