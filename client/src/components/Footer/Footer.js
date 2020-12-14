import React, {useContext, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './Footer.css'
import logo from '../../Images/logo.png'


const Footer = () =>{
    return(
<footer>
        <div className="row" id="bas">
            <div className="col-md-4 text-center ">
                <div className="textFooter">
                    <Link to="/juridique">Mentions légales</Link>
                </div>
            </div>
            <div className="col-md-4 text-center ">
                <p className="textFooter">Fée des maths</p>
            </div>
            <div className="col-md-4 text-center ">
                <p className="textFooter">Site internet du projet 9</p>
            </div>
            <div className="col-12  ">
            <img src={logo} alt= "logo" id="logofoo"/>
            </div>
        </div>
</footer>
    )
}
export default Footer